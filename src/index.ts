import Express from 'express'
import 'express-async-errors'
import cors from 'cors'

import './database/connection'
import config from './config'
import api from './routes/api'
import errorHandler from './errors/handler'

const app = Express()

app.use(cors())
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

app.use(api)
app.use(errorHandler)

app.listen(config.app.port, () => console.log('Server is ready at http://localhost:' + config.app.port))
