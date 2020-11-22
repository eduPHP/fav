import axios from 'axios'
import Feed from '../models/Feed'
import ParseXmlFeedContent, { FeedListInterface } from './ParseXmlFeedContent'
import Cache from '../util/cache'

const cache = Cache('file')

export default class {
  async handle(feed: Feed): Promise<FeedListInterface> {
    const key = `feed-list-${feed.id}`

    const cachedContent = await cache.get<FeedListInterface>(key, null)

    if (cachedContent) {
      axios.get(feed.url).then(async response => {
        const content = await ParseXmlFeedContent.parse(response.data)
        await cache.put(key, content, 1)
      })

      return cachedContent
    }

    return axios.get(feed.url).then(async response => {
      const parsedContent = await ParseXmlFeedContent.parse(response.data)
      await cache.put(key, parsedContent, 1)

      return parsedContent
    })
  }
}
