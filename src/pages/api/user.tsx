import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '@services/database';
import { encrypt } from '@util/bcrypt';

interface CreateUserInterface {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const { db } = await connect();
  const response = await db
    .collection<Omit<CreateUserInterface, '_id'>>('users')
    .insertOne({
      name: 'Fiulano',
      email: 'fulanoses@rdo.blog.br',
      password: await encrypt('secret'),
    });

  res.json(response.ops[0]);
};
