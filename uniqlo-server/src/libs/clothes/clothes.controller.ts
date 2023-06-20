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

  @ApiOperation({ summary: 'Check cloth if exist with conditions' })
  @ApiResponse({ status: 200, type: Boolean })
  @ApiQuery({ name: 'code', type: String, required: true })
  @ApiQuery({ name: 'sale', type: Boolean, required: true })
  @ApiQuery({ name: 'color', type: String, required: true })
  @ApiQuery({ name: 'size', type: String, required: true })
  @ApiQuery({ name: 'price', type: Number, required: true })
  @Get('check-if-exist')
  async checkIfExist(@Query() q): Promise<boolean> {
    const parsedPrice = parseInt(q.price);
    const parsedSale = q.sale === 'true' ? true : false;

    return await this.clothesService.checkIfExist(
      q.code,
      parsedSale,
      q.color,
      q.size,
      parsedPrice,
    );
  }

  @ApiOperation({ summary: 'Detail by code' })
  @ApiResponse({ status: 200, type: Cloth })
  @ApiQuery({ name: 'code', type: String, required: true })
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
