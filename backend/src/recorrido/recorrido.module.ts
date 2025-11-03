import { Module } from "@nestjs/common";
import { RecorridoService } from "./recorrido.service";
import { RecorridoController } from "./recorrido.controller";
import { Recorrido, RecorridoSchema } from "./entities/recorrido.entity";
import { MongooseModule } from "@nestjs/mongoose/dist/mongoose.module";

@Module({
  controllers: [RecorridoController],
  providers: [RecorridoService],
  imports: [
    MongooseModule.forFeature([{ name: Recorrido.name, schema: RecorridoSchema }]),
  ],
  exports: [RecorridoService],
})
export class RecorridoModule {}