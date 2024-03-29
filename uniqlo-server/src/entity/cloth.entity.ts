import { ApiProperty } from '@nestjs/swagger';

export class SizeColor {
  @ApiProperty({ example: 'M', description: 'Size' })
  size: string;

  @ApiProperty({ example: 'red', description: 'Color' })
  color: string;

  @ApiProperty({ example: 1, description: 'Price' })
  price: number;

  @ApiProperty({ example: true, description: 'Sale' })
  sale: boolean;
}

export class Cloth {
  @ApiProperty({ example: 'Man', description: 'Person' })
  person: string;

  @ApiProperty({ example: 'Garfield', description: 'The title of cloth' })
  title: string;

  @ApiProperty({ example: 1, description: 'The price' })
  price: number;

  @ApiProperty({ example: 1, description: 'The salePrice' })
  salePrice: number;

  @ApiProperty({ example: 'Now', description: 'time sale' })
  time: string;

  @ApiProperty({
    example: [{ size: 'M', color: 'red', price: 1, sale: true }],
    description: 'Size and color',
  })
  sizeColor: Array<SizeColor>;

  @ApiProperty({ example: 'https://hehe', description: 'Image' })
  image: string;

  @ApiProperty({ example: 'https://hehe', description: 'Url' })
  url: string;

  @ApiProperty({ example: '123', description: 'Code' })
  code: string;

  @ApiProperty({ example: true, description: 'Sale' })
  sale: boolean;
}
