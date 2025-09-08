import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { ReservaModule } from './reserva/reserva.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-xperience'),
    CommonModule,
    ReservaModule,
  ],
})
export class AppModule {}
