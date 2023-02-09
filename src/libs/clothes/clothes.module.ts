//Clothes module
import { Module } from '@nestjs/common';
import { GoogleModule } from 'src/helper/googleSheet/google.module';
import { CrawlerModule } from '../crawler/crawler.module';
import { ClothesController } from './controllers/clothes.controller';
import { ClothesService } from './providers/clothes.services';

@Module({
  imports: [CrawlerModule, GoogleModule],
  controllers: [ClothesController],
  providers: [ClothesService],
})
export class ClothesModule {}
