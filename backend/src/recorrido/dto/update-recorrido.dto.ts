import { PartialType } from '@nestjs/mapped-types';
import { CreateRecorridoDto } from './create-recorrido.dto';

export class UpdateRecorridoDto extends PartialType(CreateRecorridoDto) {}
