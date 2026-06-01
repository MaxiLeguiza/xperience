import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 Lista de dominios que tienen permiso para consumir tu microservicio
  const allowedOrigins = [
    'https://xperience-swart.vercel.app', // Tu Vercel
    'http://localhost:5173',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin not allowed: ${origin}`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PAYMENTS_SERVICE_PORT || process.env.PORT || 3002;
  // Escuchamos en 0.0.0.0 para que Render pueda asignar su propio puerto correctamente
  await app.listen(port, '0.0.0.0');
  
  console.log(`MicroServicio de pagos esta corriendo en :  ${await app.getUrl()}`);
}
bootstrap();