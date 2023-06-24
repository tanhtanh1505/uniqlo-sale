import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { ClothesModule } from '../clothes/clothes.module';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';
import { FavoritesModule } from '../favorites/favorites.module';
import { UsersModule } from '../users/users.module';
import { LoggersModule } from '../loggers/loggers.module';

@Module({
  imports: [
    ClothesModule,
    MailModule,
    FavoritesModule,
    UsersModule,
    LoggersModule,
  ],
  controllers: [CronController],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
