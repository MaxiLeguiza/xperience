import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { ReservaModule } from './reserva/reserva.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RecorridoModule } from './recorrido/recorrido.module';
import { SocketConfig } from './events/socketConfig';
import { QrModule } from './qr/qr.module';



@Module({
  imports: [
    NotificationsModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-xperience'),
    CommonModule,
    ReservaModule,
    NotificationsModule,
    RecorridoModule,
    SocketConfig,
    QrModule 
  ],
})
export class AppModule {}
