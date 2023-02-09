import { ApiProperty } from '@nestjs/swagger';

export class CrawlerResponse {
  @ApiProperty({ type: Number, example: 10 })
  numberAdded: number;

  @ApiProperty({ type: Number, example: 10 })
  numberCrawled: number;

  @ApiProperty({ type: Number, example: 10 })
  numberTotal: number;
}
