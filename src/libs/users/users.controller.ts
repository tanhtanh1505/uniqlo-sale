import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterEmailDto, RegisterEmailResponseDto } from './users.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Register Mail' })
  @ApiResponse({ status: 200 })
  @Post()
  async findAll(
    @Body() registerEmail: RegisterEmailDto,
  ): Promise<RegisterEmailResponseDto> {
    return this.usersService.registerEmail(registerEmail);
  }

  @ApiOperation({ summary: 'Get list registed mail' })
  @ApiResponse({ status: 200 })
  @Get()
  async getListRegistedMail(): Promise<string[]> {
    return this.usersService.getListRegistedMail();
  }

  @ApiOperation({ summary: 'Send noti mail' })
  @ApiResponse({ status: 200 })
  @Get('send')
  async sendMailNotiSale(): Promise<string> {
    return await this.usersService.sendMailNotiSale();
  }
}
