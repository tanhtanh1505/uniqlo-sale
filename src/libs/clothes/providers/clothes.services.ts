import { Injectable, Logger } from '@nestjs/common';
import { Cloth } from 'src/entity';
import { CrawlerResponse } from '../dto/crawler.dto';
import { CrawlerService } from 'src/libs/crawler/crawler.services';
import { GoogleService } from 'src/helper/googleSheet/google.service';
import { google } from 'googleapis';

@Injectable()
export class ClothesService {
  private readonly clothes: Cloth[] = [];
  private readonly crawlerService: CrawlerService = new CrawlerService();
  private readonly logger = new Logger(ClothesService.name);
  private googleService = new GoogleService();

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
}
