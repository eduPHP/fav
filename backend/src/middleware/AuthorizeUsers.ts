import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'

import User, { UserView } from '../models/User'
import users_view from '../views/users_view'
import { app } from '../util/config'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line no-shadow
    export interface Request {
      user: UserView
    }
  }
}

export default async (
  req: Request,
  res: Response,
  next: CallableFunction,
): Promise<Response> => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const [, token] = authHeader.split('Bearer ')

  try {
    const id = (await promisify(jwt.verify)(token, app.key)) as string
    const repo = getRepository(User)
    const user = await repo.findOneOrFail(id)
    req.user = users_view.render(user)

    return next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({ error: 'Invalid token' })
  }
}
