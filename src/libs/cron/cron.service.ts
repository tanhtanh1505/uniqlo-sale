import { Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ClothesService } from '../clothes/clothes.services';
import { UsersService } from '../users/users.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private clothesService: ClothesService,
    private usersService: UsersService,
  ) {
    this.addCronJob();
  }

  addCronJob() {
    const job = new CronJob(
      CronExpression.EVERY_HOUR,
      async () => {
        this.logger.warn(`Job added to run!`);
        const responseCrawl = await this.clothesService.crawlScheduleSale();
        let updated = false;

        for (const res of responseCrawl) {
          if (res.numberAdded != 0) {
            updated = true;
            break;
          }
        }

        if (updated) {
          await this.clothesService.saveToGoogleSheet();
          await this.usersService.sendMailNotiSale();
        }
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
