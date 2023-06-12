import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ schema: UserSchema, name: 'User' }])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
