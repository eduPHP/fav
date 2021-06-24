import { NextApiResponse, NextApiRequest, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { ValidationError } from 'yup';
import getValidationErrors from '../util/getValidationErrors';
import UserRepository, {
  UserInterface,
} from '../services/repositories/UserRepository';
import { ObjectId } from 'mongodb';

export interface AuthApiRequest extends NextApiRequest {
  user: UserInterface;
}

export const getUserFromToken = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<UserInterface | void> => {
  let bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const [, token] = bearer?.split('Bearer ');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const id = jwt.verify(token, process.env.APP_KEY) as string;

    const user = await UserRepository.find(new ObjectId(id));

    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    return user;
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

export const protect = (handler: NextApiHandler) => {
  return async (req: AuthApiRequest, res: NextApiResponse) => {
    const user = await getUserFromToken(req, res);
    if (!user) {
      return;
    }

    req.user = user;

    try {
      return handler(req, res);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(422).json({ errors: getValidationErrors(err) });
      }
      return res.status(500).json({ message: 'Server Error' });
    }
  };
};
