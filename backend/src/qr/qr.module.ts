  import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { Qr, QrSchema } from './qr.entity';

@Module({
  controllers: [QrController],
  providers: [QrService],
  imports: [MongooseModule.forFeature([{ name: Qr.name, schema: QrSchema }])],
})
export class QrModule {}
