import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from 'src/entity/log.entity';
import { CreateLoggerDto } from './loggers.dto';
import { LoggerType } from 'src/utils/enums';

@Injectable()
export class LoggersService {
  constructor(@InjectModel('Logger') private loggerModel: Model<Log>) {}

  async createLog(newLog: CreateLoggerDto) {
    const log = await this.loggerModel.create(newLog);
    return log;
  }

  async getLogs(type: LoggerType) {
    const logs = await this.loggerModel.find({ type }).sort({ createdAt: -1 });
    return logs;
  }

  async getLogsToday(types: LoggerType[]) {
    // in order to get mail logs today, we need to get logs from 00:00:00 to 23:59:59
    const today = new Date();
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );
    const logs = await this.loggerModel
      .find({ type: { $in: types }, createdAt: { $gte: start, $lt: end } })
      .sort({ createdAt: -1 });

    return logs;
  }

  async getNumberOfLogsToday(types: LoggerType[]) {
    const today = new Date();
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );
    const count = await this.loggerModel.count({
      type: { $in: types },
      createdAt: { $gte: start, $lt: end },
    });

    console.log(count);
    return count;
  }

  async removeLogsBefore(days: number) {
    const today = new Date();
    const beforeDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - days,
    );
    await this.loggerModel.deleteMany({
      createdAt: { $lt: beforeDay },
    });
  }
}
