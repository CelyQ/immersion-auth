import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(
    session({
      secret: 'mysecret',
    }),
  )

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  await app.listen(3000)
}
bootstrap()