import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Influencer, InfluencerDocument } from './entities/influencer.entity';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';

@Injectable()
export class InfluencersService {
  constructor(
    @InjectModel(Influencer.name)
    private influencerModel: Model<InfluencerDocument>,
  ) {}

  async create(dto: CreateInfluencerDto) {
    const created = new this.influencerModel(dto);
    return created.save();
  }

  async findAll() {
    return this.influencerModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const influencer = await this.influencerModel.findById(id);
    if (!influencer) throw new NotFoundException('Influencer no encontrado');
    return influencer;
  }

  async update(id: string, dto: UpdateInfluencerDto) {
    const updated = await this.influencerModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Influencer no encontrado');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.influencerModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Influencer no encontrado');
    return { message: 'Eliminado correctamente' };
  }

  // 🔥 NUEVO: Toggle followers (seguir/dejar de seguir)
  async toggleFollow(influencerId: string, userId: string) {
    const influencer = await this.influencerModel.findById(influencerId);
    if (!influencer) throw new NotFoundException('Influencer no encontrado');

    const followers = influencer.followers || [];
    const index = followers.indexOf(userId);

    if (index > -1) {
      // El usuario ya sigue, remover
      followers.splice(index, 1);
    } else {
      // El usuario no sigue, agregar
      followers.push(userId);
    }

    influencer.followers = followers;
    return influencer.save();
  }

  // 🔥 NUEVO: Actualizar países
  async updateCountries(id: string, countries: string[]) {
    const updated = await this.influencerModel.findByIdAndUpdate(
      id,
      { countries: [...new Set(countries)] }, // Remover duplicados
      { new: true }
    );
    if (!updated) throw new NotFoundException('Influencer no encontrado');
    return updated;
  }

  // 🔥 NUEVO: Obtener tours asociados (retorna IDs)
  async getTours(id: string) {
    const influencer = await this.influencerModel.findById(id, 'tours');
    if (!influencer) throw new NotFoundException('Influencer no encontrado');
    return { tours: influencer.tours || [] };
  }
}