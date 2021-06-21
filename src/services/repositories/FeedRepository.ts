import { ObjectId } from 'mongodb';
import { connect } from '../../util/database';

export interface FeedInterface {
  _id?: ObjectId;
  name: string;
  url: string;
  is_active: boolean;
  is_public: boolean;
  user?: ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

class FeedRepository {
  async create({ name, url, is_active, is_public, user }: FeedInterface): Promise<FeedInterface> {
    const { db } = await connect();

    const response = await db
      .collection<FeedInterface>('feeds')
      .insertOne({
        _id: new ObjectId(),
        name,
        url,
        is_active,
        is_public,
        user,
        created_at: new Date(),
        updated_at: new Date(),
      });

    return response.ops[0];
  }

  public async findAllFromUser(user: ObjectId): Promise<FeedInterface[]> {
    const { db } = await connect();

    const result = await db
      .collection<FeedInterface>('feeds')
      .find({ user });

    return result.toArray();
  }

  async find(id: ObjectId): Promise<FeedInterface> {
    const { db } = await connect();

    return await db
      .collection<FeedInterface>('feeds')
      .findOne({ _id: id });
  }

  async findOneFromUser(user: ObjectId, id: ObjectId): Promise<FeedInterface> {
    const { db } = await connect();

    return await db
      .collection<FeedInterface>('feeds')
      .findOne({ _id: id, user });
  }

  async delete(id: ObjectId): Promise<boolean> {
    const { db } = await connect();

    const result = await db.collection('feeds').deleteOne({ _id: id })

    return result.result.n >= 1;
  }

  async update(feed: FeedInterface): Promise<FeedInterface> {
    const { db } = await connect();

    await db.collection<FeedInterface>('feeds')
      .findOneAndReplace(
        { _id: feed._id},
        { ...feed, updated_at: new Date() }
      )

    return feed;
  }

  async findOnePublic(id: ObjectId) {
    const { db } = await connect();

    return await db
      .collection<FeedInterface>('feeds')
      .findOne({ _id: id, is_public: true, is_active: true });
  }

  async findAllPublic() {
    const { db } = await connect();

    const result = await db
      .collection<FeedInterface>('feeds')
      .find({ is_public: true, is_active: true });

    return result.toArray();
  }
}

export default new FeedRepository();
