export default {
  type: 'sqlite',
  database: ':memory:',
  logging: false,
  migrationsRun: true,
  entities: [`${__dirname}/../models/*.ts`],
  migrations: [`${__dirname}/migrations/*.ts`],
}
