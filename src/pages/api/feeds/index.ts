import { NextApiResponse } from 'next';

import FeedRepository from '../../../services/repositories/FeedRepository';
import { AuthApiRequest, protect } from '../../../middleware/apiAuth';
import { validate } from '../../../middleware/validation';
import feedSchema, { FeedType } from '../../../util/validation/feedSchema';

const handler = async (req: AuthApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name, is_active, is_public, url } = req.body as FeedType;

    const feed = await FeedRepository.create({
      name,
      is_active,
      is_public,
      url,
      user: { _id: req.user._id, email: req.user.email },
    });

    return res.json({ feed });
  }

  if (req.method === 'GET') {
    const feeds = await FeedRepository.findAllFromUser(req.user._id);

    return res.json({ feeds });
  }

  res.status(405);
};

export default protect(validate(handler, feedSchema));
