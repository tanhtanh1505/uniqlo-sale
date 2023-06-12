import {
  Controller,
  Get,
  Req,
  UseGuards,
  Post,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { Request } from 'express';
import { GoogleAuthGuard } from './utils/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.services';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  // api/auth/redirect
  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return { msg: 'OK' };
  }

  @Get('status')
  user(@Req() request: Request) {
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() req) {
    return this.authService.signIn(req);
  }
}
