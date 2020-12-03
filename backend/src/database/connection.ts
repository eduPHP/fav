import { ConnectionOptions, createConnection } from 'typeorm'
import { app } from '../util/config'
import testConfig from './tests.config'
import devConfig from './development.config'

console.log(app.env)

createConnection(
  app.env === 'test'
    ? (testConfig as ConnectionOptions)
    : (devConfig as ConnectionOptions),
)
