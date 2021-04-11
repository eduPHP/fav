import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { isAfter, isEqual } from 'date-fns'
import FetchFeedContent from '../services/FetchFeedContent'
import Feed from '../models/Feed'
import { FeedItem } from '../services/ParseXmlFeedContent';

class RssReaderController {
  async index(req: Request, res: Response): Promise<Response> {
    const feedRepository = getRepository(Feed)
    const feeds = await feedRepository.find({ where: { user_id: req.user.id } })
    const fetchFeed = new FetchFeedContent()
    const allItems = await feeds.reduce(async (acc, feed) => {
      const list = await fetchFeed.handle(feed);
      return await acc.then(agregator => agregator.concat(list.item));
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

    return res.json(allItems)
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const feedRepository = getRepository(Feed)
    const feed = await feedRepository.findOneOrFail(id)

    const fetchFeed = new FetchFeedContent()

    return res.json(await fetchFeed.handle(feed))
  }
}

export default new RssReaderController()
