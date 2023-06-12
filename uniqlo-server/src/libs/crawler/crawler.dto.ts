import { ApiProperty } from '@nestjs/swagger';
import { Person } from 'src/utils/enums';

export class CrawlerResponse {
  @ApiProperty({ type: Object.values(Person), example: 'men' })
  person: Person;

  @ApiProperty({ type: Number, example: 10 })
  numberAdded: number;

  @ApiProperty({ type: Number, example: 10 })
  numberCrawled: number;

  @ApiProperty({ type: Number, example: 10 })
  numberTotal: number;
}
