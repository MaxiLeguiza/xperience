import { PartialType } from '@nestjs/mapped-types'; // Si usas Swagger, cámbialo por @nestjs/swagger
import { CreateInfluencerDto } from './create-influencer.dto';

export class UpdateInfluencerDto extends PartialType(CreateInfluencerDto) {}