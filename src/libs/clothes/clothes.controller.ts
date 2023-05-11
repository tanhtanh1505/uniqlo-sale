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

@ApiBearerAuth()
@ApiTags('clothes')
@Controller('clothes')
export class ClothesController {
  constructor(private clothesService: ClothesService) {}

  @ApiOperation({ summary: 'Detail by url' })
  @ApiResponse({ status: 200, type: Cloth })
  @ApiQuery({ name: 'url', type: String, required: true })
  @Get('find-by-url')
  async findByUrl(@Query() q): Promise<Cloth> {
    return await this.clothesService.crawlDetails(q.url);
  }

  @ApiOperation({ summary: 'Find all' })
  @ApiResponse({ status: 200, type: Cloth })
  @Get('all')
  async findAll(): Promise<Cloth[]> {
    return this.clothesService.findAll();
  }

  @ApiOperation({ summary: 'Crawl' })
  @ApiResponse({ status: 200, type: CrawlClothResponse })
  @Get('crawl-random-sale')
  async crawlRandomSale(): Promise<CrawlClothResponse[]> {
    return await this.clothesService.crawlRandomSale();
  }

  @ApiOperation({ summary: 'Save to google sheet' })
  @ApiResponse({ status: 200 })
  @Get('save')
  async saveToGoogleSheet(): Promise<string> {
    return await this.clothesService.saveToGoogleSheet();
  }
}
