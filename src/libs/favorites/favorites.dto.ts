import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({ type: String, example: '123' })
  code: string;

  @ApiProperty({ type: String, example: 'M' })
  size: string;

  @ApiProperty({ type: String, example: 'green' })
  color: string;

  @ApiProperty({ type: Number, example: 100000 })
  price: number;
}

export class CompareFavoriteDto {
  @ApiProperty({ type: String, example: '123' })
  code: string;

  @ApiProperty({ type: String, example: 'M' })
  size: string;

  @ApiProperty({ type: String, example: 'green' })
  color: string;

  @ApiProperty({ type: Number, example: 100000 })
  price: number;
}

export class CompareResponseDto {
  @ApiProperty({ type: Boolean, example: true })
  exist: boolean;

  @ApiProperty({ type: Number, example: 100000 })
  price: number;
}

export class FavoriteResponseDto {
  @ApiProperty({ type: String, example: '123' })
  code: string;

  @ApiProperty({ type: String, example: 'M' })
  size: string;

  @ApiProperty({ type: String, example: 'green' })
  color: string;

  @ApiProperty({ type: Number, example: 100000 })
  price: number;

  @ApiProperty({ type: String, example: '123' })
  title: string;

  @ApiProperty({ type: String, example: '123' })
  image: string;

  @ApiProperty({ type: String, example: '123' })
  person: string;

  @ApiProperty({ type: String, example: '123' })
  url: string;

  @ApiProperty({ type: Number, example: '123' })
  curPrice: number;

  @ApiProperty({ type: Number, example: '123' })
  curSalePrice: number;

  @ApiProperty({ type: Boolean, example: true })
  sale: boolean;
}
