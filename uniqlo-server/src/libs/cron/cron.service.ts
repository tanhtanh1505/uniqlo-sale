import { Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ClothesService } from '../clothes/clothes.services';
import { FavoritesService } from '../favorites/favorites.services';
import { UsersService } from '../users/users.service';
import { MailService } from 'src/mail/mail.service';
import { LoggersService } from '../loggers/loggers.service';
import { LoggerType } from 'src/utils/enums';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private favoriteService: FavoritesService,
    private clothesService: ClothesService,
    private mailService: MailService,
    private userService: UsersService,
    private loggerService: LoggersService,
  ) {
    // this.addCronJob();
  }

  async jobCrawlSale() {
    let logContent = `start crawl sale at: ${new Date().toLocaleTimeString(
      'vi-VN',
    )}`;

    await this.clothesService.crawlRandomSale();
    logContent += `\nfinish crawl sale at: ${new Date().toLocaleTimeString(
      'vi-VN',
    )}`;

    await this.clothesService.saveToGoogleSheet();
    logContent += `\nfinish save to google sheet at: ${new Date().toLocaleTimeString(
      'vi-VN',
    )}`;

    const reportScan = await this.favoriteService.scan();
    for (let i = 0; i < reportScan.length; i++) {
      await this.mailService.sendMailNotiSale(reportScan[i]);
      await this.userService.updateRemainingMail(reportScan[i].user);
    }
    logContent += `\nfinish scan and send mail at: ${new Date().toLocaleTimeString(
      'vi-VN',
    )}`;

    await this.loggerService.createLog({
      type: LoggerType.Crawl,
      content: logContent,
    });
  }

  async jobRemoveOldLog() {
    await this.loggerService.removeLogsBefore(2);
  }

  addCronJob() {
    const crawlJob = new CronJob(
      CronExpression.EVERY_2_HOURS,
      async () => {
        this.logger.warn(`Crawl job added to run!`);
        await this.jobCrawlSale();
      },
      null,
      true,
      'Asia/Ho_Chi_Minh',
    );

    this.schedulerRegistry.addCronJob('uniqlo-sale', crawlJob);
    crawlJob.start();

    this.logger.warn(`job uniqlo added for each 2 hour!`);

    // log job
    const logJob = new CronJob(
      CronExpression.EVERY_2_HOURS,
      async () => {
        this.logger.warn(`Log job added to run!`);
        await this.jobRemoveOldLog();
      },
      null,
      true,
      'Asia/Ho_Chi_Minh',
    );

    this.schedulerRegistry.addCronJob('log-job', logJob);
    logJob.start();
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
    await this.jobRemoveOldLog();
  }
}
