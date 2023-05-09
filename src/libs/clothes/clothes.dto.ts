import { ApiProperty } from '@nestjs/swagger';

export class SizeaColor {
  price: string;

  @ApiProperty({ type: String, example: 'red' })
  color: string;

  @ApiProperty({ type: Number, example: 10 })
  size: number;
}
