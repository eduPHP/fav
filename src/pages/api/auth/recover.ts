import { NextApiResponse } from 'next';
import * as Yup from 'yup'
import { AuthApiRequest } from '../../../middleware/apiAuth';
import UserRepository from '../../../services/repositories/UserRepository';
import { ObjectId } from 'mongodb';
import PasswordResetsRepository from '../../../services/repositories/PasswordResetsRepository';
import mailer from '../../../util/mailer';
import services from '../../../../config/services';
import { compare, encrypt } from '../../../services/bcrypt';
import createToken from '../../../util/createToken';

interface RequestProps {
  email: string
}

const handler = async (req: AuthApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    })
    const { email } = (await schema.validate(req.body, {
      abortEarly: false,
    })) as RequestProps

    const user = await UserRepository.findByEmail(email)

    if (!user) {
      return res
        .status(422)
        .json({ errors: { email: ['Error trying to send the email.'] } })
    }

    const token = new ObjectId().toHexString()

    const passwordReset = await PasswordResetsRepository.create({
      user: user._id,
      token,
    })
    const url = `${services.site_url}/recover/${passwordReset._id}.${token}`
    const messageHtml = `
            <p>Click on the link below to update your password</p>
            <a href="${url}">
              Change your password.
            </a>
        `
    const messageText = `
             Click on the link below to update your password:
             ${url}
         `
    const result = await mailer.send(
      user.email,
      messageText,
      messageHtml,
    )

    return res.json({ sent: result.rejected.length === 0 })
  }

  if (req.method === 'PUT') {
    const { password, token } = req.body
    const [resetId, rawToken] = token.split('.')

    const passwordReset = await PasswordResetsRepository.find(
      new ObjectId(resetId)
    )

    if (
      !passwordReset ||
      passwordReset.reset_at ||
      !(await compare(passwordReset.token, rawToken))
    ) {
      return res.status(400).json({
        errors: { password: 'Não foi possível resetar sua senha.' },
      })
    }

    const user = await UserRepository.find(passwordReset.user)
    await UserRepository.update({
      ...user,
      password: await encrypt(password)
    })

    await PasswordResetsRepository.use(passwordReset)

    return res.json({
      user: UserRepository.present(user),
      token: createToken(user),
    })
  }
};

export default handler;
