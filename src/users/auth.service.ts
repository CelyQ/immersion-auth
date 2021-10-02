import * as crypto from 'crypto'
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { UsersService } from './users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email)
    if (users.length) throw new BadRequestException('this email is in use')

    const salt = this.genRandomString(24)
    const hash = this.hashPasswordSHA512(password, salt)

    const user = await this.usersService.create({
      email,
      password: salt + '.' + hash,
    })

    return user
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email)
    if (!user) throw new NotFoundException('user not found')

    const [salt, storedHash] = user.password.split('.')

    const hash = this.hashPasswordSHA512(password, salt)
    if (storedHash !== hash) throw new BadRequestException('wrong password')

    return user
  }

  private hashPasswordSHA512(password: string, salt: string): string {
    const hash = crypto.createHmac('sha512', salt)

    hash.update(password)

    return hash.digest('hex')
  }

  private genRandomString(length: number) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex') /** convert to hexadecimal format */
      .slice(0, length) /** return required number of characters */
  }
}
