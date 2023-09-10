import { Injectable, Logger } from '@nestjs/common';
import { Cloth } from 'src/entity';
import { CrawlerService } from 'src/libs/crawler/crawler.services';
import { GoogleService } from 'src/helper/googleSheet/google.service';
import { google } from 'googleapis';
import { Person } from 'src/utils/enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlsService } from '../urls/urls.service';
import { CrawlClothResponse, GetClothesReq } from './clothes.dto';

@Injectable()
export class ClothesService {
  private readonly logger = new Logger(ClothesService.name);
  private googleService = new GoogleService();

  constructor(
    @InjectModel(Cloth.name) private clothModel: Model<Cloth>,
    private readonly urlService: UrlsService,
    private readonly crawlerService: CrawlerService,
  ) {}

  async crawlRandomSale(): Promise<CrawlClothResponse[]> {
    try {
      const resultCrawl: CrawlClothResponse[] = [];

      const response = [];
      for (const person of Object.values(Person)) {
        const urls = await this.urlService.getUrlByPerson(person);
        let count = 0;
        for (const url of urls) {
          const tempRes = await this.crawlerService.crawlRandomSale(
            person,
            url,
          );
          response.push(...tempRes);
          count += tempRes.length;
        }

        const res: CrawlClothResponse = {
          person: person,
          numberCrawled: count,
        };

        resultCrawl.push(res);
      }

      await this.clothModel.deleteMany({ sale: true });

      for (const cloth of response) {
        await this.clothModel.findOneAndUpdate({ code: cloth.code }, cloth, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        });
      }

      return resultCrawl;
    } catch (e) {
      console.log(e);
    }
  }

  async crawlDetails(code: string): Promise<Cloth> {
    const cloth = await this.clothModel.findOne({ code });
    if (!cloth) {
      const newCloth = await this.crawlerService.crawlDetails(
        `https://www.uniqlo.com/vn/vi/products/${code}`,
      );
      await this.clothModel.create(newCloth);
      return newCloth;
    }

    return cloth;
  }

  async findByUrl(url: string): Promise<Cloth> {
    const code = url.split('?')[0].split('/').pop();
    return await this.crawlDetails(code);
  }

  async findAll(): Promise<Cloth[]> {
    return await this.clothModel.find({ sale: true }).exec();
  }

  async filter(req: GetClothesReq): Promise<Cloth[]> {
    const { limit, offset, persons, keyword } = req;
    const query = {
      sale: true,
    };

    if (persons && persons.length > 0) {
      query['person'] = { $in: persons };
    }

    // full text search
    if (keyword) {
      query['$text'] = { $search: keyword };
    }

    const clothes = await this.clothModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .exec();

    return clothes;
  }

  async checkIfExist(
    code: string,
    sale: boolean,
    color: string,
    size: string,
    price: number,
  ): Promise<boolean> {
    const cloth = await this.clothModel
      .findOne({
        code: code,
        sale: sale,
        sizeColor: {
          $elemMatch: {
            sale: sale,
            color: color,
            size: size,
            price: { $lte: price },
          },
        },
      })
      .exec();

    if (cloth) {
      return true;
    }

    return false;
  }

  async findByCode(code: string): Promise<Cloth> {
    return await this.clothModel.findOne({ code }).exec();
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
          .slice(0, 10)} ${timeNow.toLocaleTimeString('vi-VN')}`;

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

        if (tempClothes && tempClothes.length && tempClothes.length > 0) {
          tempClothes.forEach((cloth) => {
            rootData.push([
              cloth.code,
              cloth.title,
              cloth.price.toString(),
              cloth.salePrice.toString(),
              cloth.sizeColor
                .map((sc) => `${sc.size} - ${sc.color} - ${sc.price}`)
                .join('\n'),
              cloth.time,
              cloth.url,
              `=IMAGE("${cloth.image}")`,
            ]);
          });
        }

        await this.googleService.clearSheets(sheets, sheetId, person);

        await this.googleService.updateSheet(sheets, sheetId, person, rootData);
      }
      return `https://docs.google.com/spreadsheets/d/${sheetId}`;
    } catch (e) {
      console.log(e);
      return 'fail';
    }
  }
}
