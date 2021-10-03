import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

describe('UsersController', () => {
  let controller: UsersController
  let mockUsersService: Partial<UsersService>
  let mockAuthService: Partial<AuthService>

  beforeEach(async () => {
    mockUsersService = {
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'testpass' } as User]),
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'testpass',
        } as User),
      // update: () => {},
      // remove: () => {},
    }
    mockAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAllUsers', () => {
    it('findAllUsers returns a list of users with the given email', async () => {
      const users = await controller.findAllUsers('test@test.com')

      expect(users.length).toEqual(1)
      expect(users[0].email).toEqual('test@test.com')
    })
  })

  describe('findUser', () => {
    it('findUser returns the user with provided id', async () => {
      const user = await controller.findUser('1')

      expect(user).toBeDefined()
    })

    it('findUser throws an error if user with given id is not found', async () => {
      mockUsersService.findOne = () => null
      try {
        await controller.findUser('1')
      } catch (err) {
        expect(err.status).toEqual(404)
        expect(err.message).toEqual('user not found')
      }
    })
  })

  describe('signin', () => {
    it('signin updates session object and returns user', async () => {
      const session = { userId: null }
      const user = await controller.signin(
        {
          email: 'test@test.com',
          password: 'testpass',
        },
        session,
      )

      expect(user.id).toEqual(1)
      expect(session.userId).toEqual(1)
    })
  })
})
