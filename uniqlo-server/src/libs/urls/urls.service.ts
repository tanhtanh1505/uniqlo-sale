import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from 'src/schemas/url.schema';
import { Person } from 'src/utils/enums';

@Injectable()
export class UrlsService {
  constructor(@InjectModel('Url') private urlModel: Model<Url>) {}

  async addUrl(person: Person, url: string) {
    const urls = await this.urlModel.findOneAndUpdate(
      { person: person },
      { $push: { urls: url } },
      {
        upsert: true,
        new: true,
      },
    );
    return urls;
  }

  async getAllUrl() {
    const urls = await this.urlModel.find();
    return urls;
  }

  async getUrlByPerson(person: Person): Promise<string[]> {
    const urls = await this.urlModel.findOne({ person });
    return urls.urls;
  }
}
