import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Role } from 'src/utils/roles/role.enum';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ type: String, required: true })
  email: string;

  @ApiProperty({ type: String, required: true })
  displayName: string;

  @ApiProperty({ type: Number, required: true })
  remainingMail: number;

  @ApiProperty({ type: Array<Role>, required: true })
  roles: Role[];
}
