import { createConnection, getConnection, getRepository } from 'typeorm'

const connection = {
  async create(): Promise<void> {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      logging: false,
      migrationsRun: true,
      entities: [`${__dirname}/../src/models/*.ts`],
      migrations: [`${__dirname}/../src/database/migrations/*.ts`],
    })
  },

  async close(): Promise<void> {
    const createdConnection = await getConnection()
    if (createdConnection.isConnected) {
      try {
        setTimeout(async () => {
          await createdConnection.close()
        }, 10)
      } catch {
        //
      }
    }
  },

  async clear(): Promise<void> {
    const createdConnection = await getConnection()
    const entities = createdConnection.entityMetadatas

    entities.forEach(entity => {
      ;(async () => {
        const repository = getRepository(entity.name)
        await repository.query(`DELETE FROM ${entity.tableName} WHERE 1;`)
      })()
    })
  },
}
export default connection
