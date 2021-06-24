import { NextApiResponse } from 'next';
import { AuthApiRequest } from '../../../../middleware/apiAuth';
import FeedRepository from '../../../../services/repositories/FeedRepository';
import FetchFeedContent from '../../../../services/FetchFeedContent';

const handler = async (req: AuthApiRequest, res: NextApiResponse) => {
  const feeds = await FeedRepository.findAllPublic();

  const fetchFeed = new FetchFeedContent();

  res.setHeader(
    'Cache-Control',
    'public, max-age=55, must-revalidate, stale-while-revalidate=55',
  );

  return res.json(await fetchFeed.handleMany(feeds));
};

export default handler;
