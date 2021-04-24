import axios from 'axios';
import Feed from '../models/Feed';
import ParseXmlFeedContent, { FeedListInterface } from './ParseXmlFeedContent';

export default class {
  async handle(feed: Feed): Promise<FeedListInterface> {
    const response = await axios.get(feed.url)
    return await ParseXmlFeedContent.parse(response.data);
  }
}
