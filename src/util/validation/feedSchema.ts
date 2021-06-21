import { boolean, object, string, TypeOf } from 'yup';

const schema = object({
  name: string().required(),
  url: string().url().required(),
  is_active: boolean().required(),
  is_public: boolean().required(),
})

export type FeedType = TypeOf<typeof schema>;

export default schema
