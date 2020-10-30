import {Request, Response} from "express";
import config from "../util/config";

const jwt = require("jsonwebtoken");
const { promisify } = require("util");

import {UserView} from "../models/User";
import users_view from "../views/users_view";

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
        req.user = users_view.render(await promisify(jwt.verify)(token, config.app.key))

        return next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
