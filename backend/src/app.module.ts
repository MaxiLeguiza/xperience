import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { ReservaModule } from './reserva/reserva.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-xperience'),
    CommonModule,
    ReservaModule,
    NotificationsModule,
  ],
})
export class AppModule {}
