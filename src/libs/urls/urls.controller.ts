import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UrlsService } from './urls.service';
import { AddUrlDto } from './urls.dto';
import { Role } from 'src/utils/roles/role.enum';
import { Roles } from 'src/utils/roles/role.decorator';

@ApiBearerAuth()
@ApiTags('urls')
@Controller('urls')
export class UrlsController {
  constructor(private urlService: UrlsService) {}

  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all urls' })
  @ApiResponse({ status: 200 })
  @Get('all')
  async findAll() {
    return await this.urlService.getAllUrl();
  }

  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Add url' })
  @ApiResponse({ status: 200 })
  @Post('new')
  async add(@Body() body: AddUrlDto) {
    return await this.urlService.addUrl(body.person, body.url);
  }
}
