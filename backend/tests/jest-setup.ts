import connection from './connection'

beforeAll(async () => {
  await connection.create()
})

afterAll(async () => {
  await connection.close()
})

beforeEach(async () => {
  await connection.clear()
})
