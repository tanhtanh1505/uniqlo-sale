import { ApiProperty } from '@nestjs/swagger';
import { LoggerType } from 'src/utils/enums';

export class CreateLoggerDto {
  @ApiProperty({ type: LoggerType, required: true })
  type: LoggerType;

  @ApiProperty({ type: String, required: true })
  content: string;
}
