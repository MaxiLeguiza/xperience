import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfluencersService } from './influencers.service';
import { InfluencersController } from './influencers.controller';
import { Influencer, InfluencerSchema } from './entities/influencer.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Influencer.name, schema: InfluencerSchema }])
  ],
  controllers: [InfluencersController],
  providers: [InfluencersService],
})
export class InfluencersModule {}
