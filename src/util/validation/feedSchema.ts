import { boolean, object, string, TypeOf } from 'yup';

const feed = object({
  name: string().required(),
  url: string().url().required(),
  is_active: boolean().required(),
  is_public: boolean().required(),
});

export type FeedType = TypeOf<typeof feed>;

export default feed;
