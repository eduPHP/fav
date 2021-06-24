import { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';
import UserRepository from '@services/repositories/UserRepository';
import createToken from '@util/createToken';
import { compare } from '@util/bcrypt';

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const schema = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(6),
  });
  const { email, password } = await schema.validate(req.body, {
    abortEarly: false,
  });

  const user = await UserRepository.findByEmail(email);
  if (!user || !(await compare(user.password, password))) {
    return res.status(422).json({
      errors: { email: 'Invalid credentials.' },
    });
  }

  return res.status(200).json({
    user: UserRepository.present(user),
    token: createToken(user),
  });
}
