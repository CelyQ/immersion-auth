import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Session,
} from '@nestjs/common'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserDto } from './dtos/user.dto'
import { UsersService } from './users.service'

@Controller('user')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  async whoAMI(@Session() session: any) {
    return this.usersService.findOne(session.userId)
  }

  @Get('/')
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email)
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id))
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return user
  }

  @Post('/auth/signup')
  async signup(
    @Body() body: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.authService.signup(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Post('/auth/signin')
  async signin(
    @Body() body: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.authService.signin(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Post('/auth/signout')
  signout(@Session() session: Record<string, any>) {
    session.userId = null
  }
}
