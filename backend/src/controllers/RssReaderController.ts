import { Request, Response } from 'express';
import axios from 'axios';
import { getRepository } from 'typeorm';
import Feed from '../models/Feed';
import Xml  from '../util/Xml';
import Cache from '../util/cache';

const cache = Cache('file');

class RssReaderController {
  async index(req: Request, res: Response) {
    const key = req.originalUrl || req.url;
    const cachedBody = await cache.get(key);

    if (cachedBody) {
      res.json(cachedBody);
    }

    const { id } = req.params;
    const feedRepository = getRepository(Feed);

    const feed = await feedRepository.findOneOrFail(id);

    const content = await axios.get(feed.url).then(async response => {
      return await Xml.parse(response.data);
    });

    await cache.put(key, content);

    if (!cachedBody) {
      return res.json(content);
    }
  }
}

export default new RssReaderController();
