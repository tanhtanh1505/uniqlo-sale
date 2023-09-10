import { ApiProperty } from '@nestjs/swagger';
import { SizeColor } from 'src/entity';
import { Person } from 'src/utils/enums';

export class CrawlClothResponse {
  @ApiProperty({ type: Object.values(Person), example: 'men' })
  person: Person;

  @ApiProperty({ type: Number, example: 10 })
  numberCrawled: number;
}

export class SizeColorAdded extends SizeColor {
  @ApiProperty({ example: false, description: 'Added' })
  added: boolean;
}

export class GetClothesReq {
  @ApiProperty({ example: 0, description: 'Limit' })
  limit: number;

  @ApiProperty({ example: 0, description: 'Offset' })
  offset: number;

  @ApiProperty({ example: Person.Men, description: 'Person' })
  persons: Person[];

  @ApiProperty({ example: 'cloth', description: 'Keyword' })
  keyword: string;
}
