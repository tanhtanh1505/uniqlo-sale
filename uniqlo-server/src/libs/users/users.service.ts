import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { CreateUserDto } from './users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(user: CreateUserDto) {
    return await this.userModel.create(user);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }
}
