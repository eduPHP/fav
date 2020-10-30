import {Request, Response} from 'express'
import {getRepository} from "typeorm"
import * as Yup from 'yup'

import createToken from "../util/createToken"
import users_view from "../views/users_view"
import bcrypt from "../util/bcrypt"
import User from "../models/User"

export default {
    async store(req: Request, res: Response) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
        })
        await schema.validate(req.body, {abortEarly: false})

        const repo = getRepository(User)
        const {email, password} = req.body

        const user = await repo.findOne({email})

        if (!user || !await bcrypt.compare(user.password, password)) {
            return res.status(422).json({
                errors: {email: ['Credenciais inválidas.']}
            })
        }

        return res.json({
            user: users_view.render(user),
            token: createToken(user)
        })
    }
}
