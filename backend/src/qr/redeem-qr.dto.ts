import { IsString, MinLength } from 'class-validator';

export class RedeemQrDto {
  @IsString()
  @MinLength(10)
  token: string;
}
