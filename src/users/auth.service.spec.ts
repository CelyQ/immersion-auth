import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { UsersService } from './users.service'

describe('AuthService', () => {
  let service: AuthService
  let mockUsersService: Partial<UsersService>

  beforeEach(async () => {
    const users: User[] = []

    mockUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email)
        return Promise.resolve(filteredUsers)
      },
      create: ({ email, password }) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User
        users.push(user)
        return Promise.resolve(user)
      },
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', async () => {
    expect(service).toBeDefined()
  })

  describe('signup', () => {
    it('creates a new user with a salted and hashed password', async () => {
      const user = await service.signup('test@test.com', 'testpass')
      const [salt, hash] = user.password.split('.')

      expect(user.password).not.toEqual('testpass')
      expect(salt).toBeDefined()
      expect(hash).toBeDefined()
    })

    it('throws an error when email is already in use', async () => {
      await service.signup('test@test.com', 'password')
      try {
        await service.signup('test@test.com', 'testpass')
      } catch (err) {
        expect(err.status).toEqual(400)
        expect(err.message).toEqual('this email is in use')
      }
    })
  })

  describe('signin', () => {
    it('throws an error when try to sign in with an unused email', async () => {
      try {
        await service.signin('test@test.com', 'testpass')
      } catch (err) {
        expect(err.status).toEqual(404)
        expect(err.message).toEqual('user not found')
      }
    })

    it('throws an error when an invalid password is provided', async () => {
      await service.signup('test@test.com', 'testpass')
      try {
        await service.signin('test@test.com', 'wrongpassword')
      } catch (err) {
        expect(err.status).toEqual(400)
        expect(err.message).toEqual('wrong password')
      }
    })

    it('returns a user when correct password is provided', async () => {
      await service.signup('test@test.com', 'testpass')

      const user = await service.signin('test@test.com', 'testpass')

      expect(user).toBeDefined()
    })
  })
})
