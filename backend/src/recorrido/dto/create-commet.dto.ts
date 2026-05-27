import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  user: string;

  @IsString()
  userId: string;

  @Min(1)
  @Max(5)
  @IsNumber()
  rating: number;

  @IsString()
  text: string;
}
