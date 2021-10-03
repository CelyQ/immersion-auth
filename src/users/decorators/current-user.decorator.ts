import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '../user.entity'

export const CurrentUser = createParamDecorator(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    const currentUser = request.currentUser as User

    return currentUser
  },
)
