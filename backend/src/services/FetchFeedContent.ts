import axios from 'axios'
import { isAfter, isEqual } from 'date-fns'
import Feed from '../models/Feed'
import ParseXmlFeedContent, {
  FeedItem,
  FeedListInterface,
} from './ParseXmlFeedContent'

interface ResponseFeedItem extends FeedItem {
  provider_id: number
}

interface ResponseFeedListInterface extends Omit<FeedListInterface, 'item'> {
  item: ResponseFeedItem[]
}

export default class {
  async handle(feed: Feed): Promise<ResponseFeedListInterface> {
    try {
      const response = await axios.get(feed.url)
      const content = await ParseXmlFeedContent.parse(response.data)
      return {
        ...content,
        item: content.item.map(i => ({ ...i, provider_id: feed.id })),
      }
    } catch {
      return {
        item: [],
        link: feed.url,
        title: 'Not Found',
        updatedAt: Date.toString(),
      }
    }
  }

  async handleMany(feeds: Feed[]): Promise<ResponseFeedItem[]> {
    try {
      const allItems = await feeds.reduce(async (acc, feed) => {
        const list = await this.handle(feed)
        return acc.then(agregator => agregator.concat(list.item))
      }, Promise.resolve<ResponseFeedItem[]>([]))

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
