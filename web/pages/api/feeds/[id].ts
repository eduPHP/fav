import { NextApiRequest, NextApiResponse } from 'next';

type Feed = {
  id: number;
  name: string;
  url: string;
};

export type FeedResource = {
  feed: Feed;
};
export default (req: NextApiRequest, res: NextApiResponse<FeedResource>) => {
  res.status(200).json({
    feed: {
      id: 1,
      name: `Test ${req.query.id}`,
      url: 'https://google.com',
    },
  });
};
