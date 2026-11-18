import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2')

   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //solo devuelve el data que estas esperando aunque envies parametros de mas, los remueve
      forbidNonWhitelisted: true,//vlida que no envie propiedades de mas , asi que lo marca como error
      transform:true,//para pasar las validaciones
      transformOptions:{//para pasar las validaciones
        enableImplicitConversion:true
      }
    
    }),
  )
  await app.listen(process.env.PORT ?? 3000);
  console.log('app running on port'+process.env.PORT)
}
await bootstrap();
