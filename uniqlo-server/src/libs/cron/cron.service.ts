import { Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ClothesService } from '../clothes/clothes.services';
import { FavoritesService } from '../favorites/favorites.services';
import { UsersService } from '../users/users.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private favoriteService: FavoritesService,
    private clothesService: ClothesService,
    private mailService: MailService,
    private userService: UsersService,
  ) {
    // this.addCronJob();
  }

  async jobCrawlSale() {
    const responseCrawl = await this.clothesService.crawlRandomSale();
    let updated = false;

    for (const res of responseCrawl) {
      if (res.numberCrawled > 0) {
        updated = true;
        break;
      }
    }

    if (updated) {
      await this.clothesService.saveToGoogleSheet();
      const reportScan = await this.favoriteService.scan();
      const listMailUser = [];

      for (let i = 0; i < reportScan.length; i++) {
        const user = await this.userService.findOne(reportScan[i].user);
        listMailUser.push(user.email);
      }

      await this.mailService.sendMailNotiSale(listMailUser);
    }
  }

  addCronJob() {
    const job = new CronJob(
      CronExpression.EVERY_HOUR,
      async () => {
        this.logger.warn(`Job added to run!`);
        await this.jobCrawlSale();
      },
      null,
      true,
      'Asia/Ho_Chi_Minh',
    );

    this.schedulerRegistry.addCronJob('uniqlo-sale', job);
    job.start();

    this.logger.warn(`job uniqlo added for each hour!`);
  }

  restartCron() {
    try {
      this.schedulerRegistry.getCronJob('uniqlo-sale').start();
      this.logger.warn(`job uniqlo restarted!`);
    } catch (e) {
      this.logger.warn(`job uniqlo not found!`);
      this.addCronJob();
    }
  }

  deleteCron() {
    try {
      this.schedulerRegistry.getCronJob('uniqlo-sale').stop();
      this.logger.warn(`job crawl uniqlo deleted!`);
    } catch (e) {
      this.logger.warn(`job uniqlo not found!`);
    }
  }

  async testJob() {
    this.logger.warn(`job test run!`);
    await this.jobCrawlSale();
  }
}
