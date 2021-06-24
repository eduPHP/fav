import { NextApiRequest, NextApiResponse } from 'next';
import UserRepository from '../../../services/repositories/UserRepository';
import createToken from '../../../util/createToken';
import { validate } from '../../../middleware/validation';
import userSchema from '../../../util/validation/userSchema';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password } = req.body;

  const exists = await UserRepository.findByEmail(email);
  if (exists) {
    return res.status(422).json({
      errors: { email: 'This email is already taken.' },
    });
  }

  const user = await UserRepository.create({ name, email, password });

  res.status(200).json({
    user: UserRepository.present(user),
    token: createToken(user),
  });
};

export default validate(handler, userSchema);
