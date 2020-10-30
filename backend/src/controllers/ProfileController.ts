import {Request, Response} from 'express'
import {getRepository} from "typeorm"

import users_view from "../views/users_view"
import User from "../models/User"

export default {
    async show(req: Request, res: Response) {
        const repo = getRepository(User)
        const user = await repo.findOneOrFail(req.user.id)

        return res.json({user: users_view.render(user)})
    }
}
