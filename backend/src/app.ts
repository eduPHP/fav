import 'express-async-errors'
import Express from 'express'
import cors from 'cors'
import './database/connection'
import routes from './routes'
import errorHandler from './errors/handler'

class AppService {
  public app

  constructor() {
    this.app = Express()

    this.middleware()
    this.routes()
    this.handler()
  }

  middleware() {
    this.app.use(cors())
    this.app.use(Express.json())
    this.app.use(Express.urlencoded({ extended: true }))
  }

  routes() {
    this.app.use('/api', ...routes)
  }

  handler() {
    this.app.use(errorHandler)
  }
}

export default new AppService().app
