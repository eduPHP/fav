import { NextApiResponse } from 'next';
import { AuthApiRequest, protect } from '@middleware/apiAuth';
import FeedRepository from '@services/repositories/FeedRepository';
import FetchFeedContent from '@services/FetchFeedContent';

const handler = async (req: AuthApiRequest, res: NextApiResponse) => {
  const feeds = await FeedRepository.findAllFromUser(req.user._id, true);

  const fetchFeed = new FetchFeedContent();

  return res.json(await fetchFeed.handleMany(feeds));
};
export default protect(handler);
