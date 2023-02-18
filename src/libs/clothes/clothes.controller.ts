import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Cloth } from 'src/entity';
import { CrawlerResponse } from '../crawler/crawler.dto';
import { ClothesService } from './clothes.services';

@ApiBearerAuth()
@ApiTags('clothes')
@Controller('clothes')
export class ClothesController {
  constructor(private clothesService: ClothesService) {}

  @ApiOperation({ summary: 'Find all' })
  @ApiResponse({ status: 200, type: Cloth })
  @Get()
  async findAll(): Promise<Cloth[]> {
    return this.clothesService.findAll();
  }

  @ApiOperation({ summary: 'Crawl' })
  @ApiResponse({ status: 200, type: CrawlerResponse })
  @Get('crawl-schedule-sale')
  async crawlScheduleSale(): Promise<CrawlerResponse[]> {
    return await this.clothesService.crawlScheduleSale();
  }

  @ApiOperation({ summary: 'Crawl' })
  @ApiResponse({ status: 200, type: CrawlerResponse })
  @Get('crawl-random-sale')
  async crawlRandomSale(): Promise<CrawlerResponse[]> {
    return await this.clothesService.crawlRandomSale();
  }

  @ApiOperation({ summary: 'Save to google sheet' })
  @ApiResponse({ status: 200 })
  @Get('save')
  async saveToGoogleSheet(): Promise<string> {
    return await this.clothesService.saveToGoogleSheet();
  }
}
