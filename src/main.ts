import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 300000,
      },
    }),
  );
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
