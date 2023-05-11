import { Injectable, Logger } from '@nestjs/common';
import { Cloth } from 'src/entity';
import { CrawlerService } from 'src/libs/crawler/crawler.services';
import { GoogleService } from 'src/helper/googleSheet/google.service';
import { google } from 'googleapis';
import { Person } from 'src/utils/enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlsService } from '../urls/urls.service';
import { CrawlClothResponse } from './clothes.dto';

@Injectable()
export class ClothesService {
  private readonly crawlerService: CrawlerService = new CrawlerService();
  private readonly logger = new Logger(ClothesService.name);
  private googleService = new GoogleService();

  constructor(
    @InjectModel(Cloth.name) private clothModel: Model<Cloth>,
    private readonly urlService: UrlsService,
  ) {}

  async crawlRandomSale(): Promise<CrawlClothResponse[]> {
    try {
      const resultCrawl: CrawlClothResponse[] = [];
      await this.clothModel.deleteMany({});

      for (const person of Object.values(Person)) {
        const response = [];
        const urls = await this.urlService.getUrlByPerson(person);
        console.log(urls);
        for (const url of urls) {
          const tempRes = await this.crawlerService.crawlRandomSale(
            person,
            url,
          );
          response.push(...tempRes);
          this.clothModel.insertMany(tempRes);
        }

        const res: CrawlClothResponse = {
          person: person,
          numberCrawled: response.length,
        };

        resultCrawl.push(res);
      }

      return resultCrawl;
    } catch (e) {
      console.log(e);
    }
  }

  async crawlDetails(url: string): Promise<Cloth> {
    return await this.crawlerService.crawlDetails(url);
  }

  async findAll(): Promise<Cloth[]> {
    return await this.clothModel.find().exec();
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
          'Code',
          'Title',
          'Price (VND)',
          'Sale Price',
          'Size Color',
          'Time',
          'Url',
          'Image',
          lastestUpdate,
        ];
        rootData.push(columnTitles);

        const tempClothes = await this.clothModel.find({ person });

        console.log(tempClothes);
        if (tempClothes && tempClothes.length && tempClothes.length > 0) {
          tempClothes.forEach((cloth) => {
            rootData.push([
              cloth.code,
              cloth.title,
              cloth.price,
              cloth.salePrice,
              cloth.sizeColor.join('\n'),
              cloth.time,
              cloth.url,
              `=IMAGE("${cloth.image}")`,
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
