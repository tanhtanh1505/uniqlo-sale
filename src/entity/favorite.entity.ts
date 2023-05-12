import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export class Favorite {
  @ApiProperty({ example: '123', description: 'User' })
  user: User;

  @ApiProperty({ example: '123', description: 'Code' })
  code: string;

  @ApiProperty({ example: 'M', description: 'Size' })
  size: string;

  @ApiProperty({ example: 'green', description: 'Size' })
  color: string;

  @ApiProperty({ example: 1000000, description: 'The price' })
  price: number;
}
