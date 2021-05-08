import axios from 'axios'
import { isAfter, isEqual } from 'date-fns'
import Feed from '../models/Feed'
import ParseXmlFeedContent, {
  FeedItem,
  FeedListInterface,
} from './ParseXmlFeedContent'

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

  async handleMany(feeds: Feed[]): Promise<FeedItem[]> {
    try {
      const allItems = await feeds.reduce(async (acc, feed) => {
        const list = await this.handle(feed)
        return acc.then(agregator => agregator.concat(list.item))
      }, Promise.resolve<FeedItem[]>([]))

      allItems.sort((a, b) => {
        const aDate = a.pubDate
        const bDate = b.pubDate

        if (isEqual(aDate, bDate)) {
          return 0
        }

        if (isAfter(aDate, bDate)) {
          return -1
        }

        return 1
      })

      return allItems
    } catch {
      return []
    }
  }
}
