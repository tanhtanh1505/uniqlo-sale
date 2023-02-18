import { ApiProperty } from '@nestjs/swagger';

export class Cloth {
  @ApiProperty({ example: 'Garfield', description: 'The title of cloth' })
  title: string;

  @ApiProperty({ example: 1, description: 'The price' })
  price: string;

  @ApiProperty({ example: 1, description: 'The salePrice' })
  salePrice: string;

  @ApiProperty({ example: 'Now', description: 'time sale' })
  time: string;

  @ApiProperty({ example: 'https://hehe', description: 'Url' })
  url: string;
}
