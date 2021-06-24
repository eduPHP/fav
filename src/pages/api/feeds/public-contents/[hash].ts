import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import FeedRepository from '@services/repositories/FeedRepository';
import FetchFeedContent from '@services/FetchFeedContent';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = new ObjectId(req.query.hash as string);

  const feed = await FeedRepository.findOnePublic(id);

  if (!feed) {
    return res.status(404).json({ error: 'Not Found.' });
  }

  const fetchFeed = new FetchFeedContent();

  res.setHeader(
    'Cache-Control',
    'public, max-age=55, must-revalidate, stale-while-revalidate=55',
  );

  return res.json(await fetchFeed.handle(feed));
};

export default handler;
