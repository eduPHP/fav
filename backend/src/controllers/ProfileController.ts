import { Request, Response } from 'express'
import { getRepository, Not } from 'typeorm'

import * as Yup from 'yup'
import users_view from '../views/users_view'
import User from '../models/User'
import bcrypt from '../util/bcrypt'

export default {
  async show(req: Request, res: Response): Promise<Response> {
    const repo = getRepository(User)
    const user = await repo.findOneOrFail(req.user.id)

    return res.json({ user: users_view.render(user) })
  },

  async update(req: Request, res: Response): Promise<Response> {
    if (!req.body.password.length) {
      delete req.body.password
    }
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: req.body.password
        ? Yup.string().min(6).required()
        : Yup.string(),
    })
    const data = await schema.validate(req.body, { abortEarly: false })

    const repo = getRepository(User)

    const user = await repo.findOneOrFail(req.user.id)

    const emailExists = await repo.findOne({
      email: data?.email,
      id: Not(req.user.id),
    })

    if (emailExists) {
      throw new Error(`The email ${data?.email} is already taken`)
    }

    if (data?.password) {
      data.password = await bcrypt.encrypt(data.password)
    }

    await repo.save({ ...user, ...data })

    return res.json(users_view.render(user))
  },
}
