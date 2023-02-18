import { Injectable, Logger } from '@nestjs/common';
import { Cloth } from 'src/entity';
import { CrawlerResponse } from '../crawler/crawler.dto';
import { CrawlerService } from 'src/libs/crawler/crawler.services';
import { GoogleService } from 'src/helper/googleSheet/google.service';
import { google } from 'googleapis';
import { Person, Urls } from 'src/utils/enums';

@Injectable()
export class ClothesService {
  private readonly clothes: Map<string, Cloth[]> = new Map();
  private readonly crawlerService: CrawlerService = new CrawlerService();
  private readonly logger = new Logger(ClothesService.name);
  private googleService = new GoogleService();

  async crawlScheduleSale(): Promise<CrawlerResponse[]> {
    try {
      const resultCrawl: CrawlerResponse[] = [];

      for (const person of Object.values(Person)) {
        const response = await this.crawlerService.crawlScheduleSale(
          `https://www.uniqlo.com/vn/vi/feature/limited-offers/${person}`,
        );

        const tempClothes = this.clothes.get(person) || [];

        const oldSize = tempClothes.length;

        response.forEach((cloth) => {
          tempClothes.push(cloth);
        });

        this.clothes.set(person, tempClothes);

        const res: CrawlerResponse = {
          person: person,
          numberAdded: tempClothes.length - oldSize,
          numberCrawled: response.length,
          numberTotal: tempClothes.length,
        };

        resultCrawl.push(res);
      }

      return resultCrawl;
    } catch (e) {
      console.log(e);
    }
  }

  async crawlRandomSale(): Promise<CrawlerResponse[]> {
    //maintaining
    try {
      const resultCrawl: CrawlerResponse[] = [];
      this.logger.debug('run here');
      this.logger.debug(Object.keys(Urls));
      for (const person of Object.keys(Urls)) {
        this.logger.debug(person);
        this.logger.debug('run here');
        if (true) continue;
        const response = await this.crawlerService.crawlRandomSale(
          `https://www.uniqlo.com/vn/vi/${person}/tops/tops-collections`,
        );

        const tempClothes = this.clothes.get(person) || [];

        const oldSize = tempClothes.length;

        response.forEach((cloth) => {
          tempClothes.push(cloth);
        });

        this.clothes.set(person, tempClothes);

        const res: CrawlerResponse = {
          person: Person[person as keyof typeof Person],
          numberAdded: tempClothes.length - oldSize,
          numberCrawled: response.length,
          numberTotal: tempClothes.length,
        };

        resultCrawl.push(res);
      }

      return resultCrawl;
    } catch (e) {
      console.log(e);
    }
  }

  findAll(): Cloth[] {
    return Array.from(this.clothes.values()).reduce(
      (acc, cur) => acc.concat(cur),
      [],
    );
  }

  async saveToGoogleSheet() {
    try {
      const sheetId = process.env.SHEET_ID;
      const client = await this.googleService.Authorize();
      const sheets = google.sheets({ version: 'v4', auth: client });

      for (const person of Object.values(Person)) {
        const rootData: Array<Array<string>> = [];
        const timeNow = new Date();
        const lastestUpdate = `Lastest Update: ${timeNow
          .toISOString()
          .slice(0, 10)} ${timeNow.toLocaleTimeString()}`;

        const columnTitles = [
          'Title',
          'Price',
          'Sale Price',
          'Time',
          'Url',
          lastestUpdate,
        ];
        rootData.push(columnTitles);

        const tempClothes = this.clothes.get(person);
        if (tempClothes && tempClothes.length && tempClothes.length > 0) {
          tempClothes.forEach((cloth) => {
            rootData.push([
              cloth.title,
              cloth.price,
              cloth.salePrice,
              cloth.time.toString(),
              cloth.url,
            ]);
          });
        }

        await this.googleService.clearSheets(sheets, sheetId, person);

        await this.googleService.updateSheet(sheets, sheetId, person, rootData);
      }
      return 'success';
    } catch (e) {
      console.log(e);
      return 'fail';
    }
  }
}
