import jwt from "jsonwebtoken";
import config from "./config";
import User from "../models/User";

export default (user: User) => jwt.sign(
    `${user.email}.${user.id}`,
    config.app.key
)
