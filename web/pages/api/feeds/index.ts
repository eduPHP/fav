import { NextApiRequest, NextApiResponse } from 'next';

type Feed = {
  id: number;
  name: string;
  url: string;
};

export type FeedsList = {
  feeds: Feed[];
};
export default (req: NextApiRequest, res: NextApiResponse<FeedsList>) => {
  res.status(200).json({
    feeds: [
      {
        id: 1,
        name: 'Test 1',
        url: 'https://google.com',
      },
      {
        id: 2,
        name: 'Test 2',
        url: 'https://rdo.blog.br',
      },
      {
        id: 3,
        name: 'Test 3',
        url: 'https://youtube.com',
      },
    ],
  });
};
