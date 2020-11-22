import { database } from './src/util/config'

const { user, name, port, password, host, type } = database

export = {
  type,
  host,
  port,
  username: user,
  password,
  database: name,
  logging: false,
  entities: [`${__dirname}/src/models/*.ts`],
  migrations: [`${__dirname}/src/database/migrations/*.ts`],
  cli: {
    migrationsDir: `${__dirname}/src/database/migrations`,
  },
}
