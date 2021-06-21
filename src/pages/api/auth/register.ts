import { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';
import UserRepository from '../../../services/repositories/UserRepository';
import createToken from '../../../util/createToken';

export default async function registerHandler(req: NextApiRequest, res: NextApiResponse) {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().required().email(),
    password: Yup.string().required().min(6),
  })
  const { name, email, password } = await schema.validate(req.body, {
    abortEarly: false,
  })

  const exists = await UserRepository.findByEmail(email);
  if (exists) {
    return res.status(422).json({
      errors: { email: 'This email is already taken.' }
    })
  }

  const user = await UserRepository.create({ name, email, password });

  return res.status(200).json({
    user: UserRepository.present(user),
    token: createToken(user)
  })
}
