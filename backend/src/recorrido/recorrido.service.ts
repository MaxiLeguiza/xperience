import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRecorridoDto } from './dto/create-recorrido.dto';
import { UpdateRecorridoDto } from './dto/update-recorrido.dto';
import { Recorrido } from './entities/recorrido.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RecorridoService {
  constructor(
    @InjectModel(Recorrido.name)
    private readonly recorridoModel: Model<Recorrido>,
  ) {}

  async create(createRecorridoDto: CreateRecorridoDto) {
    try {
      const recorrido = await this.recorridoModel.create(createRecorridoDto);
      return recorrido;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.recorridoModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid recorrido id: ${id}`);
    }
    const recorrido = await this.recorridoModel.findById(id);
    if (!recorrido) {
      throw new NotFoundException(`Recorrido with id ${id} not found`);
    }
    return recorrido;
  }

  async update(id: string, updateRecorridoDto: UpdateRecorridoDto) {
    const recorrido = await this.findOne(id);
    try {
      await recorrido.updateOne(updateRecorridoDto, { new: true });
      return { ...recorrido.toJSON(), ...updateRecorridoDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.recorridoModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Recorrido with id ${id} not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Recorrido exists ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Can't create Recorrido - Check server logs`,
    );
  }
}