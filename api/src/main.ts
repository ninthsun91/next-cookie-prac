import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use((req: Request, res: Response, next: NextFunction) => {
    const referer = req.headers['referer'];
    console.log('referer', referer || req.headers);
    next();
  });

  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });
  app.use(cookieParser());
  app.use(express.json());

  await app.listen(3001);
}
bootstrap();
