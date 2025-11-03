import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: 'https://localhost:5173', //process.env.FRONT ||  Reemplaza con la URL de tu frontend de React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // --- Swagger ---
  const config = new DocumentBuilder()
    .setTitle('API - Xperience')
    .setDescription('Documentación de la API')
    .setVersion('1.0.0')
    .addBearerAuth() // si usás JWT; sino quitá esta línea
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
