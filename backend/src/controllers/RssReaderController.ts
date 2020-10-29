import {Request, Response} from 'express'
import axios from 'axios'
import {getRepository} from "typeorm";
import Feed from "../models/Feed";
import Xml from "../util/Xml";

class RssReaderController {
    async index(req: Request, res: Response) {
        const { id } = req.params
        const feedRepository = getRepository(Feed)

        const feed = await feedRepository.findOneOrFail(id)

        const content = await axios.get(feed.url).then(async response => {
            return await Xml.parse(response.data)
        })

        return res.json(content)
    }
}

export default new RssReaderController()
