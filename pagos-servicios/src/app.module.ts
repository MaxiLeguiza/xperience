import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <-- Importa
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Carga el .env
    }),
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}