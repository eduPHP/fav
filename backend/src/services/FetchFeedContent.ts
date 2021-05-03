import axios from 'axios'
import Feed from '../models/Feed'
import ParseXmlFeedContent, { FeedListInterface } from './ParseXmlFeedContent'

export default class {
  async handle(feed: Feed): Promise<FeedListInterface> {
    try {
      const response = await axios.get(feed.url)
      return ParseXmlFeedContent.parse(response.data)
    } catch {
      return {
        item: [],
        link: feed.url,
        title: 'Not Found',
        updatedAt: Date.toString(),
      }
    }
  }
}
