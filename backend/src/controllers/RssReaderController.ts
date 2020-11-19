import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import FetchFeedContent from '../services/FetchFeedContent'
import Feed from '../models/Feed'

class RssReaderController {
  async index(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const feedRepository = getRepository(Feed)
    const feed = await feedRepository.findOneOrFail(id)

    const fetchFeed = new FetchFeedContent()

    return res.json(await fetchFeed.handle(feed))
  }
}

export default new RssReaderController()
