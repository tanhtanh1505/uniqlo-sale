import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { ClothesModule } from '../clothes/clothes.module';
import { UsersModule } from '../users/users.module';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';

@Module({
  imports: [ClothesModule, MailModule, UsersModule],
  controllers: [CronController],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
