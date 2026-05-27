import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreateRecorridoDto } from './dto/create-recorrido.dto';
import { UpdateRecorridoDto } from './dto/update-recorrido.dto';
import { Recorrido } from './entities/recorrido.entity';
import { CreateCommentDto } from './dto/create-commet.dto';
import { Influencer } from '../influencers/entities/influencer.entity';

@Injectable()
export class RecorridoService {
  constructor(
    @InjectModel(Recorrido.name)
    private readonly recorridoModel: Model<Recorrido>,
    @InjectModel(Influencer.name)
    private readonly influencerModel: Model<Influencer>,
  ) {}

  async create(createRecorridoDto: CreateRecorridoDto) {
    try {
      // 🔥 Si hay influencerId, buscar y copiar datos del influencer
      const dataToCreate = { ...createRecorridoDto };

      if (
        createRecorridoDto.influencerId &&
        isValidObjectId(createRecorridoDto.influencerId)
      ) {
        const influencer = await this.influencerModel
          .findById(createRecorridoDto.influencerId)
          .lean();

        if (influencer) {
          dataToCreate.influencer = {
            _id: influencer._id.toString(),
            name: influencer.name,
            avatar: influencer.avatar,
            social: influencer.handle,
          };
        }
      }

      const recorrido = await this.recorridoModel.create(dataToCreate);
      return recorrido;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // ✅ IMPORTANTE:
  // NO uses .populate("influencerId")
  // porque influencerId NO es una relación mongoose.
  // influencer es un objeto embebido.

  async findAll() {
    return this.recorridoModel.find().lean();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }

    const recorrido = await this.recorridoModel.findById(id).lean();

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
      const dataToUpdate = { ...updateRecorridoDto };

      // 🔥 Si hay influencerId en la actualización, buscar y copiar datos del influencer
      if (
        updateRecorridoDto.influencerId &&
        isValidObjectId(updateRecorridoDto.influencerId)
      ) {
        const influencer = await this.influencerModel
          .findById(updateRecorridoDto.influencerId)
          .lean();

        if (influencer) {
          dataToUpdate.influencer = {
            _id: influencer._id.toString(),
            name: influencer.name,
            avatar: influencer.avatar,
            social: influencer.handle,
          };
        }
      }

      const updated = await this.recorridoModel.findByIdAndUpdate(
        id,
        dataToUpdate,
        {
          new: true,
        },
      );

      if (!updated) {
        throw new NotFoundException(`Recorrido with id ${id} not found`);
      }

      return updated;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async addComment(id: string, createCommentDto: CreateCommentDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }

    const recorrido = await this.recorridoModel.findById(id);

    if (!recorrido) {
      throw new NotFoundException(`Recorrido with id ${id} not found`);
    }

    if (!recorrido.comments) {
      recorrido.comments = [];
    }

    const newComment = {
      ...createCommentDto,
      timestamp: Date.now(),
    };

    recorrido.comments.push(newComment);

    // ✅ recalcular promedio
    const total = recorrido.comments.reduce(
      (acc, comment) => acc + comment.rating,
      0,
    );

    recorrido.rating =
      recorrido.comments.length > 0 ? total / recorrido.comments.length : 0;

    await recorrido.save();

    return recorrido;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }

    const res = await this.recorridoModel.deleteOne({
      _id: id,
    });

    if (res.deletedCount === 0) {
      throw new BadRequestException(`Recorrido with id ${id} not found`);
    }

    return;
  }

  private handleExceptions(error: any) {
    console.log(error);

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
