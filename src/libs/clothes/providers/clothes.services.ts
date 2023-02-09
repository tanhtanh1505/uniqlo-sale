import { Injectable, Logger } from '@nestjs/common';
import { Cloth } from 'src/entity';
import { CrawlerResponse } from '../dto/crawler.dto';
import { CrawlerService } from 'src/libs/crawler/crawler.services';
import { GoogleService } from 'src/helper/googleSheet/google.service';
import { google } from 'googleapis';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class ClothesService {
  private readonly clothes: Cloth[] = [];
  private readonly crawlerService: CrawlerService = new CrawlerService();
  private readonly logger = new Logger(ClothesService.name);

  constructor(
    private googleService: GoogleService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    //this.addCronJob();
  }

  async crawl(): Promise<CrawlerResponse> {
    try {
      const response = await this.crawlerService.crawl(
        'https://www.uniqlo.com/vn/vi/feature/limited-offers/men',
      );

      const oldSize = this.clothes.length;

      response.forEach((cloth) => {
        if (cloth && !this.clothes.find((c) => c.url === cloth.url))
          this.clothes.push(cloth);
      });

      const res: CrawlerResponse = {
        numberAdded: this.clothes.length - oldSize,
        numberCrawled: response.length,
        numberTotal: this.clothes.length,
      };

      return res;
    } catch (e) {
      console.log(e);
    }
  }

  findAll(): Cloth[] {
    return this.clothes;
  }

  async saveToGoogleSheet() {
    try {
      const sheetId = process.env.SHEET_ID;
      const client = await this.googleService.Authorize();
      const sheets = google.sheets({ version: 'v4', auth: client });

      const rootData: Array<Array<string>> = [];

      const columnTitles = ['Title', 'Price', 'Sale Price', 'Time', 'URL'];
      rootData.push(columnTitles);

      this.clothes.forEach((cloth) => {
        rootData.push([
          cloth.title,
          cloth.price,
          cloth.salePrice,
          cloth.time.toString(),
          cloth.url,
        ]);
      });

      await this.googleService.updateSheet(sheets, sheetId, 'men', rootData);

      return 'success';
    } catch (e) {
      console.log(e);
      return 'fail';
    }
  }

  addCronJob() {
    const job = new CronJob(
      CronExpression.EVERY_SECOND,
      () => {
        this.logger.warn(`Job added to run!`);
      },
      null,
      true,
      'Asia/Ho_Chi_Minh',
    );

    this.schedulerRegistry.addCronJob('uniqlo-sale', job);
    job.start();

    this.logger.warn(`job uniqlo added for each minute at seconds!`);
  }

  restartCron() {
    this.schedulerRegistry.getCronJob('uniqlo-sale').start();
    this.logger.warn(`job uniqlo restarted!`);
  }

  deleteCron() {
    this.schedulerRegistry.getCronJob('uniqlo-sale').stop();
    this.logger.warn(`job crawl uniqlo deleted!`);
  }
}
