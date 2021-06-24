import { NextApiResponse } from 'next';
import feedSchema, { FeedType } from '../../../util/validation/feedSchema';
import { AuthApiRequest, protect } from '../../../middleware/apiAuth';
import { validate } from '../../../middleware/validation';
import FeedRepository from '../../../services/repositories/FeedRepository';
import { ObjectId } from 'mongodb';

const handler = async (req: AuthApiRequest, res: NextApiResponse) => {
  const id = new ObjectId(req.query.hash as string);

  const feed = await FeedRepository.findOneFromUser(req.user._id, id);

  if (!feed) {
    return res.status(404).json({ error: 'Not Found.' });
  }

  if (req.method === 'GET') {
    return res.json({ feed });
  }

  if (req.method === 'PUT') {
    const { name, is_active, is_public, url } = req.body as FeedType;

    Object.assign(feed, {
      name,
      is_active,
      is_public,
      url,
    });

    const updated = await FeedRepository.update(feed);

    return res.json({ feed: updated });
  }

  if (req.method === 'DELETE') {
    const deleted = await FeedRepository.delete(id);

    return res.status(deleted ? 201 : 400).json({ deleted });
  }

  res.status(405);
};

export default protect(validate(handler, feedSchema));
