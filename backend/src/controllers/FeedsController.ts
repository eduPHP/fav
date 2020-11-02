import {Request, Response} from 'express'
import * as Yup from 'yup'
import Feed from "../models/Feed";
import {getRepository} from "typeorm";
import feedsView from '../views/feeds'

class FeedsController {
    async store(req: Request, res: Response) {
        const feedRepository = getRepository(Feed)
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            url: Yup.string().url().required(),
            active: Yup.boolean(),
            user: Yup.object().shape({
                id: Yup.number(),
            })
        })

        const data = await schema.validate({...req.body, user: req.user}, {abortEarly: false}) as Feed
        // data.user_id = req.user.id

        const feed = await feedRepository.create(data)
        await feedRepository.save(feed)

        return res.status(201).json({feed: feedsView.render(feed)})
    }

    async index(req: Request, res: Response) {
        const feedRepository = getRepository(Feed)

        const feeds = await feedRepository.find({where: {user_id: req.user.id}})

        return res.json({feeds: feedsView.renderMany(feeds)})
    }

    async show(req: Request, res: Response) {
        const { id } = req.params

        const feedRepository = getRepository(Feed)

        const feed = await feedRepository.findOneOrFail({id: parseInt(id), user_id: req.user.id})

        return res.json({feed: feedsView.render(feed)})
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

        let feed = await feedRepository.findOneOrFail({id: parseInt(id), user_id: req.user.id})
        await feedRepository.save({...feed, ...data})

        return res.json({feed: feedsView.render({...feed, ...data})})
    }

    async destroy(req: Request, res: Response) {
        const { id } = req.params
        const feedRepository = getRepository(Feed)

        let deleted = true
        let feed = await feedRepository.findOneOrFail({id: parseInt(id), user_id: req.user.id})

        await feedRepository.delete(feed.id).catch(e => {
            deleted = false
        })

        return res.json({deleted})
    }
}

export default new FeedsController()
