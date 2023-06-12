import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.services';

@Module({
  imports: [],
  controllers: [],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
