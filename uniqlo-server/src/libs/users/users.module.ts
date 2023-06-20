import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: UserSchema, name: 'User' }]),
    MailModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
