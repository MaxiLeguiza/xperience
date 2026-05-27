import { Module } from "@nestjs/common";
import { RecorridoService } from "./recorrido.service";
import { RecorridoController } from "./recorrido.controller";
import { Recorrido, RecorridoSchema } from "./entities/recorrido.entity";
import { Influencer, InfluencerSchema } from "../influencers/entities/influencer.entity";
import { MongooseModule } from "@nestjs/mongoose/dist/mongoose.module";

@Module({
  controllers: [RecorridoController],
  providers: [RecorridoService],
  imports: [
    MongooseModule.forFeature([
      { name: Recorrido.name, schema: RecorridoSchema },
      { name: Influencer.name, schema: InfluencerSchema },
    ]),
  ],
  exports: [RecorridoService],
})
export class RecorridoModule {}