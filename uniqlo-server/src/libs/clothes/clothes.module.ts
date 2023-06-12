//Clothes module
import { Module } from '@nestjs/common';
import { GoogleModule } from 'src/helper/googleSheet/google.module';
import { CrawlerModule } from '../crawler/crawler.module';
import { ClothesController } from './clothes.controller';
import { ClothesService } from './clothes.services';
import { MongooseModule } from '@nestjs/mongoose';
import { Cloth, ClothSchema } from 'src/schemas/cloth.schema';
import { UrlsModule } from '../urls/urls.module';

@Module({
  imports: [
    CrawlerModule,
    GoogleModule,
    UrlsModule,
    MongooseModule.forFeature([{ schema: ClothSchema, name: Cloth.name }]),
  ],
  controllers: [ClothesController],
  providers: [ClothesService],
  exports: [ClothesService],
})
export class ClothesModule {}
