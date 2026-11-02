import { join } from 'node:path'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)

  app.enableCors({ origin: config.getOrThrow<string>('FRONTEND_URL'), credentials: true })
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))

  await app.listen(config.get<number>('PORT', 3001))
}

void bootstrap()
