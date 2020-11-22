import { join, resolve } from 'path'
import { config } from 'dotenv'

config({
  path: resolve(
    join(
      __dirname,
      '..', // src
      '..', // backend
      '.env',
    ),
  ),
})

export const app = {
  port: process.env.SERVER_PORT,
  env: process.env.NODE_ENV || 'development',
  key: process.env.APP_KEY || '',
  frontend: process.env.APP_FRONTEND_HOST || 'http://192.168.2.101:3000',
  backend: process.env.APP_BACKEND_HOST || 'http://192.168.2.101:3333',
}

export const database = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  port: process.env.DB_PORT,
}

export const mail = {
  host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.MAIL_PORT || '2525', 10),
  user: process.env.MAIL_USER || '',
  pass: process.env.MAIL_PASS || '',
  secure: Boolean(process.env.MAIL_SECURE) || false,
  from: {
    name: process.env.MAIL_FROM || 'Eduardo Dev',
    email: process.env.MAIL_FROM_EMAIL || 'edu@rdo.blog.br',
  },
}

export default {
  app,
  database,
  mail,
}
