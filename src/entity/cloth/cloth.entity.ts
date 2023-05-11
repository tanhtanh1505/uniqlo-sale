import { ApiProperty } from '@nestjs/swagger';

export class Cloth {
  @ApiProperty({ example: 'Man', description: 'Person' })
  person: string;

  @ApiProperty({ example: 'Garfield', description: 'The title of cloth' })
  title: string;

  @ApiProperty({ example: 1, description: 'The price' })
  price: string;

  @ApiProperty({ example: 1, description: 'The salePrice' })
  salePrice: string;

  @ApiProperty({ example: 'Now', description: 'time sale' })
  time: string;

  @ApiProperty({ example: ['M-red', 'L-green'], description: 'Size and color' })
  sizeColor: Array<string>;

  @ApiProperty({ example: 'https://hehe', description: 'Image' })
  image: string;

  @ApiProperty({ example: 'https://hehe', description: 'Url' })
  url: string;

  @ApiProperty({ example: '123', description: 'Code' })
  code: string;
}
