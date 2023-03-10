import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RegisterEmailDto {
  @IsEmail()
  @ApiProperty({ type: String, required: true })
  email: string;
}

export class RegisterEmailResponseDto {
  @ApiProperty({ type: String, required: true })
  message: string;
}
