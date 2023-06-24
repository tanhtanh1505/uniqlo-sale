import { Module } from '@nestjs/common';
import { LoggersService } from './loggers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerSchema } from 'src/schemas/logger.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: LoggerSchema, name: 'Logger' }]),
  ],
  providers: [LoggersService],
  exports: [LoggersService],
})
export class LoggersModule {}
