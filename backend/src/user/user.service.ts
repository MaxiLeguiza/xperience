import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.create(createUserDto);
      return user;

    } catch (error) {
      if ( error.code === 11000 ) {
        throw new BadRequestException(`User exists ${ JSON.stringify( error.keyValue ) }`);
      }
      throw new InternalServerErrorException(`Can't create User - Check server logs`);
    }
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
  if (!isValidObjectId(id)) {
    throw new BadRequestException(`Invalid user id: ${id}`);
  }

  const user = await this.userModel.findById(id);

  if (!user) {
    throw new NotFoundException(`User with id ${id} not found`);
  }
  return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
