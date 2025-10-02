import { Module } from '@nestjs/common';
import { NotificationsController } from './notificatios.controller';
import { NotificationsService } from './notifications.service';

@Module({
    controllers: [NotificationsController],
    providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
