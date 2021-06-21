import jwt from 'jsonwebtoken'
import { UserInterface } from '../services/repositories/UserRepository';

export default (user: UserInterface): string => jwt.sign(`${user._id}`, process.env.APP_KEY)
