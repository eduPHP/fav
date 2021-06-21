import { NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { AuthApiRequest, protect } from '../../../../middleware/apiAuth';
import FeedRepository from '../../../../services/repositories/FeedRepository';
import FetchFeedContent from '../../../../services/FetchFeedContent';

const handler = async (req: AuthApiRequest, res: NextApiResponse) => {
  const id = new ObjectId(req.query.hash as string);

  const feed = await FeedRepository.findOneFromUser(req.user._id, id);

  if (!feed) {
    return res.status(404).json({ error: 'Not Found.' });
  }

  const fetchFeed = new FetchFeedContent();

  return res.json(await fetchFeed.handle(feed));
};

export default protect(handler);
