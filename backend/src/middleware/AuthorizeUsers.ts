import {Request, Response} from "express";
import {getRepository} from "typeorm";
import jwt from 'jsonwebtoken'
import {promisify} from 'util'

import User, {UserView} from "../models/User";
import users_view from "../views/users_view";
import config from "../util/config";

declare global {
    namespace Express {
        export interface Request {
            user: UserView;
        }
    }
}

export default async (req: Request, res: Response, next: CallableFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    const [, token] = authHeader.split("Bearer ");

    try {
        const id = await promisify(jwt.verify)(token, config.app.key) as string
        const repo = getRepository(User)
        const user = await repo.findOneOrFail(id)
        req.user = users_view.render(user)

        return next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: "Invalid token" });
    }
};
