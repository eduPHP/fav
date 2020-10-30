import {Request, Response} from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import createToken from "../util/createToken"
import users_view from "../views/users_view"
import bcrypt from "../util/bcrypt"
import User from "../models/User"

export default {
    async store(req: Request, res: Response) {
        const repo = getRepository(User)

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required().email(),
            password: Yup.string().required().min(6),
        })

        const data = await schema.validate(req.body, {abortEarly: false}) as User

        let [, usersCount] = await repo.findAndCount({email: data.email})
        if (usersCount) {
            return res.status(422).json({
                email: 'E-mail já cadastrado.'
            })
        }

        data.password = await bcrypt.encrypt(data.password)

        const user = repo.create(data)

        await repo.save(user)

        return res.status(201).json({
            user: users_view.render(user),
            token: createToken(user)
        })
    }
}
