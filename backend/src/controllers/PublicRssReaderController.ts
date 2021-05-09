import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import FetchFeedContent from '../services/FetchFeedContent'
import Feed from '../models/Feed'

class PublicRssReaderController {
  async index(req: Request, res: Response): Promise<Response> {
    const feedRepository = getRepository(Feed)
    const feeds = await feedRepository.find({
      where: { active: true, public: true },
    })
    const fetchFeed = new FetchFeedContent()

    return res.json(await fetchFeed.handleMany(feeds))
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const feedRepository = getRepository(Feed)
    const feed = await feedRepository.findOneOrFail(id, {
      where: { active: true, public: true },
    })

    const fetchFeed = new FetchFeedContent()

    return res.json(await fetchFeed.handle(feed))
  }
}

export default new PublicRssReaderController()
