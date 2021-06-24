import { NextApiResponse } from 'next';
import { AuthApiRequest, protect } from '@middleware/apiAuth';
import UserRepository from '@services/repositories/UserRepository';
import { validate } from '@middleware/validation';
import { updateSchema } from '@services/validation/userSchema';
import { encrypt } from '@util/bcrypt';

const handler = async (req: AuthApiRequest, res: NextApiResponse) => {
  const user = await UserRepository.find(req.user._id);

  if (req.method === 'PUT') {
    if (req.body.password.length) {
      req.body.password = await encrypt(req.body.password);
    } else {
      delete req.body.password;
    }

    Object.assign(user, req.body);

    try {
      await UserRepository.update(user);
    } catch (e) {
      return res.status(422).json({ errors: { email: e.message } });
    }

    return res.json({ user: UserRepository.present(user) });
  }

  if (req.method === 'GET') {
    return res.json({ user: UserRepository.present(user) });
  }

  res.status(405);
};

export default protect(validate(handler, updateSchema));
