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
      this.handleExceptions( error );
    }
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(term: string) {

  if (!isValidObjectId(term)) {
    throw new BadRequestException(`Invalid user id: ${term}`);
  }

  const user = await this.userModel.findById(term);

  if (!user) {
    throw new NotFoundException(`User with id ${term} not found`);
  }
  return user;
  }

  async update(term: string, updateUserDto: UpdateUserDto) {

    const user = await this.findOne(term);
    
    try {

      await user.updateOne( updateUserDto, { new: true });
      return { ...user.toJSON(), ...updateUserDto };

    } catch (error) {
      this.handleExceptions( error );
    }

  }

  async remove(id: string) {

    // const user = await this.findOne(id);
    // await user.deleteOne();

    //const deleted = await this.userModel.findByIdAndDelete(id);

    const { deletedCount } = await this.userModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`User with id ${id} not found`);
    }

    return;
  }

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`User exists ${ JSON.stringify( error.keyValue ) }`);
    }
    throw new InternalServerErrorException(`Can't create User - Check server logs`);

  }

  }
