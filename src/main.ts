import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  // secured connection
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname,'..', 'ssl', 'privkey.pem')),
    cert: fs.readFileSync(path.join(__dirname,'..', 'ssl', 'fullchain.pem')),
  };
  
  const app = process.env.ENV === 'dev' ? 
  await NestFactory.create(AppModule) : 
  await NestFactory.create(AppModule, {
    httpsOptions,
  });


  app.setGlobalPrefix('api')
  app.enableCors()
  await app.listen(3000);
}
bootstrap();
