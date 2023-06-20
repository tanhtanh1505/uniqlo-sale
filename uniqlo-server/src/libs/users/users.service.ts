import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { CreateUserDto } from './users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private mailService: MailService,
  ) {}

  async create(user: CreateUserDto) {
    await this.mailService.sendMailRegisted(user.email);
    return await this.userModel.create(user);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async findOne(user: User) {
    return await this.userModel.findOne(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }
}
