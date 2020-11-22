import { getRepository } from 'typeorm'
import supertest from 'supertest'
import User from '../../src/models/User'
import bcrypt from '../../src/util/bcrypt'
import app from '../../src/app'

describe('Authentication', () => {
  it('should return a jwt token when credentials are correct', async () => {
    const data = {
      name: 'Edu',
      email: 'edu@rdo.blog.br',
      password: 'secret',
    }

    const repo = getRepository(User)
    data.password = await bcrypt.encrypt(data.password)
    const user = repo.create(data)
    await repo.save(user)

    const { body, status } = await supertest(app).post('/api/auth/login').send({
      email: 'edu@rdo.blog.br',
      password: 'secret',
    })

    expect(status).toBe(200)
    expect(body).toEqual(
      expect.objectContaining({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }),
    )
    expect(body.token).toMatch(/^[A-Za-z0-9._-]{60,}$/)
  })
})
