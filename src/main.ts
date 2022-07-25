import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Below cookieSession and ValidationPipe codes moved to app.module.ts file to be used by e2e tests also

  // app.use(cookieSession({
  //   keys: ['asdswdacr']
  // }))

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true
  //   })
  // );
  
  await app.listen(3000);
}
bootstrap();
