import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Cloth } from 'src/entity';
import { ClothesService } from './clothes.services';
import { CrawlClothResponse } from './clothes.dto';
import { Roles } from 'src/utils/roles/role.decorator';
import { Role } from 'src/utils/roles/role.enum';

@ApiTags('clothes')
@Controller('clothes')
export class ClothesController {
  constructor(private clothesService: ClothesService) {}

  @ApiOperation({ summary: 'Detail by url' })
  @ApiResponse({ status: 200, type: Cloth })
  @ApiQuery({ name: 'url', type: String, required: true })
  @Get('find-by-url')
  async findByUrl(@Query() q): Promise<Cloth> {
    return await this.clothesService.findByUrl(q.url);
  }

  @Get('find-by-code')
  async findByCode(@Query() q): Promise<Cloth> {
    return await this.clothesService.findByUrl(q.code);
  }

  @ApiOperation({ summary: 'Find all' })
  @ApiResponse({ status: 200, type: Cloth })
  @Get('all')
  async findAll(): Promise<Cloth[]> {
    return this.clothesService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crawl' })
  @ApiResponse({ status: 200, type: CrawlClothResponse })
  @Roles(Role.Admin)
  @Get('crawl-random-sale')
  async crawlRandomSale(): Promise<CrawlClothResponse[]> {
    return await this.clothesService.crawlRandomSale();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save to google sheet' })
  @ApiResponse({ status: 200 })
  @Roles(Role.Admin)
  @Get('save')
  async saveToGoogleSheet(): Promise<string> {
    return await this.clothesService.saveToGoogleSheet();
  }
}
