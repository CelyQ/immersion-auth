import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('Authentication System (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('handles a signup request', async () => {
    const email = 'test@test.com'

    const response = await request(app.getHttpServer())
      .post('/user/auth/signup')
      .send({ email, password: 'testpass' })

    const { id, email: responseEmail } = response.body
    const { status } = response

    expect(id).toBeDefined()
    expect(responseEmail).toEqual(email)
    expect(status).toEqual(201)
  })

  it('signup as a new user, then get the currently logged in user', async () => {
    const email = 'test@test.com'

    const signupResponse = await request(app.getHttpServer())
      .post('/user/auth/signup')
      .send({ email, password: 'testpass' })

    const cookie = signupResponse.get('Set-Cookie')
    const { body, status } = await request(app.getHttpServer())
      .get('/user/whoami')
      .set('Cookie', cookie)

    expect(status).toEqual(200)
    expect(body.email).toEqual(email)
  })
})
