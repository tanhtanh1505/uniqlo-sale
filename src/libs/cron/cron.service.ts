import { Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.addCronJob();
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
