import Express from 'express'
// ideal syntax: import routes from './routes'
import routes from './routes/index.js'
// ideal syntax: import config from './config'
import config from './config.js'

const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

routes.api(app)

app.listen(config.app.port, () => console.log('Server is ready ' + config.app.port))