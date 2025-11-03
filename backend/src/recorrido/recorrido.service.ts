import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import { CreateRecorridoDto } from "./dto/create-recorrido.dto";
import { UpdateRecorridoDto } from "./dto/update-recorrido.dto";
import { Recorrido } from "./entities/recorrido.entity";

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
    return this.recorridoModel.find().lean();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }
    const recorrido = await this.recorridoModel.findById(id);
    if (!recorrido) {
      throw new NotFoundException(`Recorrido with id ${id} not found`);
    }
    return recorrido;
  }

  async update(id: string, updateRecorridoDto: UpdateRecorridoDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }
    try {
      const updated = await this.recorridoModel.findByIdAndUpdate(
        id,
        updateRecorridoDto,
        { new: true },
      );
      if (!updated) {
        throw new NotFoundException(`Recorrido with id ${id} not found`);
      }
      return updated;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }
    const res = await this.recorridoModel.deleteOne({ _id: id });
    if (res.deletedCount === 0) {
      throw new BadRequestException(`Recorrido with id ${id} not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error?.code === 11000) {
      throw new BadRequestException(
        `Recorrido exists ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Can't process Recorrido - Check server logs`,
    );
  }
}