import { Module } from '@nestjs/common';
import { GoogleModule } from 'src/helper/googleSheet/google.module';
import { MailModule } from 'src/mail/mail.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [GoogleModule, MailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
