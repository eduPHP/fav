import { connect } from '../../util/database';
import { encrypt } from '../bcrypt';
import { ObjectId } from 'mongodb';

interface CreatePasswordResetInterface {
  user: ObjectId;
  token: string;
}
interface PasswordResetInterface {
  _id: ObjectId;
  token: string;
  user: ObjectId;
  reset_at: Date | null;
  created_at: Date;
}

class PasswordResetsRepository {
  async create({
    user,
    token,
  }: CreatePasswordResetInterface): Promise<PasswordResetInterface> {
    const { db } = await connect();

    const response = await db
      .collection<PasswordResetInterface>('password_resets')
      .insertOne({
        _id: new ObjectId(),
        user,
        token: await encrypt(token),
        reset_at: null,
        created_at: new Date(),
      });

    return response.ops[0];
  }

  async use(passwordReset: PasswordResetInterface): Promise<void> {
    const { db } = await connect();

    await db
      .collection<PasswordResetInterface>('password_resets')
      .findOneAndReplace(
        { _id: passwordReset._id },
        {
          ...passwordReset,
          reset_at: new Date(),
        },
      );
  }

  async find(id: ObjectId): Promise<PasswordResetInterface> {
    const { db } = await connect();

    return db
      .collection<PasswordResetInterface>('password_resets')
      .findOne({ _id: id });
  }
}

export default new PasswordResetsRepository();
