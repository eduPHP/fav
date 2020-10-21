import {Request, Response} from 'express'
import * as Yup from 'yup'
import Feed from "../models/Feed";
import {getRepository} from "typeorm";

class FeedsController {
    async store(req: Request, res: Response) {
        const feedRepository = getRepository(Feed)
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            url: Yup.string().url().required(),
            active: Yup.boolean()
        })

        const data = await schema.validate(req.body, {abortEarly: true}) as Feed

        const feed = feedRepository.create(data)
        await feedRepository.save(feed)

        return res.status(201).json({feed})
    }

    async index(req: Request, res: Response) {
        const feedRepository = getRepository(Feed)

        const feeds = await feedRepository.find()

        return res.json({feeds})
    }

    async show(req: Request, res: Response) {
        const { id } = req.params

        const feedRepository = getRepository(Feed)

        const feed = await feedRepository.findOneOrFail(id)

        return res.json({feed})
    }

    async update(req: Request, res: Response) {
        const { id } = req.params
        const feedRepository = getRepository(Feed)
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            url: Yup.string().url().required(),
            active: Yup.boolean()
        })

        const data = await schema.validate(req.body, {abortEarly: true}) as Feed

        await feedRepository.update(id, data)
        const feed = await feedRepository.findOneOrFail(id)

        return res.json({feed})
    }

    async destroy(req: Request, res: Response) {
        const { id } = req.params
        const feedRepository = getRepository(Feed)

        let deleted = true
        await feedRepository.delete(id).catch(e => {
            deleted = false
        })

        return res.json({deleted})
    }
}

export default new FeedsController()
