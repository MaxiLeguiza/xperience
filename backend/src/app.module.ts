import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { ReservaModule } from './reserva/reserva.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RecorridoModule } from './recorrido/recorrido.module';
import { SocketConfig } from './events/socketConfig';
import { QrModule } from './qr/qr.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { InfluencersModule } from './influencers/influencers.module';


@Module({
  imports: [

    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_DATABASE || 'MONGODB_URI',),

    NotificationsModule,
    UserModule,
    CommonModule,
    ReservaModule,
    NotificationsModule,
    RecorridoModule,
    SocketConfig,
    QrModule,
    MailModule,
    InfluencersModule 
  ],
})
export class AppModule {}
