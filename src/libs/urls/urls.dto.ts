import { ApiProperty } from '@nestjs/swagger';
import { Person } from 'src/utils/enums';

export class AddUrlDto {
  @ApiProperty({ type: Object.values(Person), example: 'men', required: true })
  person: Person;

  @ApiProperty({ type: String, required: true })
  url: string;
}
