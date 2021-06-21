import jwt from 'jsonwebtoken'
import { PresentUser } from '../services/repositories/UserRepository';

export default (user: PresentUser): string => jwt.sign(`${user._id}`, process.env.APP_KEY)
