import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 'ejemlpo@gmail.com' })
  email: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token: string;

  @ApiProperty({ example: 'ws_123' })
  workspaceId: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
