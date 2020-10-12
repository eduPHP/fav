import Express from 'express'
import routes from './routes/index.js'
import config from './config.js'
import cors from 'cors'

const app = Express()

app.use(cors())
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

routes.api(app)

app.listen(config.app.port, () => console.log('Server is ready at http://localhost:' + config.app.port))