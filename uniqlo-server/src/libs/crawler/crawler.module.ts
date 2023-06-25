import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.services';
import { LoggersModule } from '../loggers/loggers.module';

@Module({
  imports: [LoggersModule],
  controllers: [],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
