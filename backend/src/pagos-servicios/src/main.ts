import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Habilito CORS para que el back principal de la app pueda llamarlo
  app.enableCors();

  //LLamos el puerto del .env con 3002 con fallbak (Corta fuego por si no anda el .env)
  const port = process.env.PAYMENTS_SERVICE_PORT || 3002;
  await app.listen(port);
  console.log(
    `MicroServicio de pagos esta corriendo en :  ${await app.getUrl()}`,
  );
}
bootstrap();
