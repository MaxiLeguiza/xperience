import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { Reserva, ReservaSchema } from './entities/reserva.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ReservaController],
  providers: [ReservaService],
  imports: [
    MongooseModule.forFeature([{ name: Reserva.name, schema: ReservaSchema }]),
  ],
})
export class ReservaModule {}