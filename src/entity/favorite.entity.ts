import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export class Favorite {
  @ApiProperty({ example: '123', description: 'User' })
  user: User;

  @ApiProperty({ example: 'https://hehe', description: 'Url' })
  url: string;

  @ApiProperty({ example: '123', description: 'Code' })
  code: string;

  @ApiProperty({ example: 'Garfield', description: 'The title of cloth' })
  title: string;

  @ApiProperty({ example: 'M', description: 'Size' })
  size: string;

  @ApiProperty({ example: 'green', description: 'Size' })
  color: string;

  @ApiProperty({ example: 1000000, description: 'The price' })
  price: number;
}
