import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InfluencersService } from './influencers.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';

@Controller('influencers')
export class InfluencersController {
  constructor(private readonly influencersService: InfluencersService) {}

  @Post()
  create(@Body() dto: CreateInfluencerDto) {
    console.log('DTO RECIBIDO:', dto);
    return this.influencersService.create(dto);
  }

  @Get()
  findAll() {
    return this.influencersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.influencersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInfluencerDto) {
    return this.influencersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.influencersService.remove(id);
  }

  // 🔥 NUEVO: Toggle Followers
  @Post(':id/toggle-follow')
  toggleFollow(@Param('id') influencerId: string, @Body() body: { userId: string }) {
    return this.influencersService.toggleFollow(influencerId, body.userId);
  }

  // 🔥 NUEVO: Actualizar Países
  @Patch(':id/countries')
  updateCountries(@Param('id') id: string, @Body() body: { countries: string[] }) {
    return this.influencersService.updateCountries(id, body.countries);
  }

  // 🔥 NUEVO: Obtener tours asociados
  @Get(':id/tours')
  getTours(@Param('id') id: string) {
    return this.influencersService.getTours(id);
  }
}
