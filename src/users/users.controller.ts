import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '../guards/auth.guard'
import { Serialize } from '../interceptors/serialize.interceptor'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current-user.decorator'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserDto } from './dtos/user.dto'
import { User } from './user.entity'
import { UsersService } from './users.service'

@Controller('user')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoAMI(@CurrentUser() user: User) {
    return user
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
