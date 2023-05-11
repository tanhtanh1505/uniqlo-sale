import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({ type: String, example: '123' })
  url: string;

  @ApiProperty({ type: String, example: 'M' })
  size: string;

  @ApiProperty({ type: String, example: 'green' })
  color: string;

  @ApiProperty({ type: String, example: '100' })
  price: string;
}
