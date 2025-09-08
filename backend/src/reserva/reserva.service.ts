import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReservaService {
  constructor(
    @InjectModel(Reserva.name)
    private readonly reservaModel: Model<Reserva>,
  ) {}

  async create(createReservaDto: CreateReservaDto) {
    try {
      const reserva = await this.reservaModel.create(createReservaDto);
      return reserva;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.reservaModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid reserva id: ${id}`);
    }
    const reserva = await this.reservaModel.findById(id);
    if (!reserva) {
      throw new NotFoundException(`Reserva with id ${id} not found`);
    }
    return reserva;
  }

  async update(id: string, updateReservaDto: UpdateReservaDto) {
    const reserva = await this.findOne(id);
    try {
      await reserva.updateOne(updateReservaDto, { new: true });
      return { ...reserva.toJSON(), ...updateReservaDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.reservaModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Reserva with id ${id} not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Reserva exists ${JSON.stringify(error.keyValue)}`);
    }
    throw new InternalServerErrorException(`Can't create Reserva - Check server logs`);
  }
}