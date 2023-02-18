import { Injectable, Logger } from '@nestjs/common';
import { Cloth } from 'src/entity';
import { CrawlerResponse } from '../crawler/crawler.dto';
import { CrawlerService } from 'src/libs/crawler/crawler.services';
import { GoogleService } from 'src/helper/googleSheet/google.service';
import { google } from 'googleapis';
import { Person } from 'src/utils/enums';

@Injectable()
export class ClothesService {
  private readonly clothes: Map<string, Cloth[]> = new Map();
  private readonly personUrls: Map<string, string[]> = new Map();
  private readonly crawlerService: CrawlerService = new CrawlerService();
  private readonly logger = new Logger(ClothesService.name);
  private googleService = new GoogleService();

  constructor() {
    this.init();
    for (const person of Object.values(Person)) {
      this.clothes.set(person, []);
    }
  }

  async init() {
    this.logger.debug('init url');
    const sheetId = process.env.SHEET_USERS;
    const client = await this.googleService.Authorize();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const res = await this.googleService.getSheet(sheets, sheetId, 'url');

    for (const person of Object.values(Person)) {
      const urls = [];
      const indexColumn = res[0].indexOf(person);
      let indexRow = 1;
      while (res[indexRow] && res[indexRow][indexColumn]) {
        urls.push(res[indexRow][indexColumn]);
        indexRow++;
      }
      this.personUrls.set(person, urls);
    }
    console.log(this.personUrls);
  }

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
    try {
      const resultCrawl: CrawlerResponse[] = [];
      for (const person of Object.values(Person)) {
        const response = [];
        for (const url of this.personUrls.get(person)) {
          const tempRes = await this.crawlerService.crawlRandomSale(url);
          response.push(...tempRes);
        }

        const oldSize = this.clothes.get(person).length;

        this.clothes.set(person, response);

        const res: CrawlerResponse = {
          person: person,
          numberAdded: this.clothes.get(person).length - oldSize,
          numberCrawled: response.length,
          numberTotal: this.clothes.get(person).length,
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
      this.logger.debug('save to google sheet');
      const sheetId = process.env.SHEET_CLOTHES;
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
        console.log(person);

        console.log(tempClothes);
        if (tempClothes && tempClothes.length && tempClothes.length > 0) {
          tempClothes.forEach((cloth) => {
            rootData.push([
              cloth.title,
              cloth.price,
              cloth.salePrice,
              cloth.time,
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
