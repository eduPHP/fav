import { connect } from '../../util/database';
import { encrypt } from '../bcrypt';
import md5 from 'md5';
import { ObjectId } from 'mongodb';

export interface UserInterface {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface PresentUser {
  _id: string;
  email: string;
  name: string;
  avatar: string;
}

class UserRepository {
  async create({ name, email, password }: UserInterface): Promise<UserInterface> {
    const { db } = await connect();

    const response = await db
      .collection<UserInterface>('users')
      .insertOne({
        _id: new ObjectId(),
        name,
        email,
        password: await encrypt(password),
        created_at: new Date(),
        updated_at: new Date(),
      });

    return response.ops[0];
  }

  public async findByEmail(email: string): Promise<UserInterface> {
    const { db } = await connect();

    return await db
      .collection<UserInterface>('users')
      .findOne({ email });
  }

  present(user: UserInterface): PresentUser {
    return {
      _id: user._id.toHexString(),
      email: user.email,
      name: user.name,
      avatar: `https://www.gravatar.com/avatar/${md5(user.email)}?d=mp&s=80`,
    };
  }

  async find(id: ObjectId): Promise<UserInterface> {
    const { db } = await connect();

    return await db
      .collection<UserInterface>('users')
      .findOne({ _id: id });
  }

  async update(user: UserInterface): Promise<UserInterface> {
    const { db } = await connect();

    if (user.password) {
      user.password = await encrypt(user.password)
    }

    const emailExists = await db
      .collection<UserInterface>('users')
      .findOne({ email: user.email, _id: { $ne: user._id } })

    if (emailExists) {
      throw new Error('Email is already taken.')
    }

    await db
      .collection<UserInterface>('users')
      .findOneAndReplace(
        { _id: user._id },
        { ...user, updated_at: new Date() }
      );

    return user;
  }
}

export default new UserRepository();
