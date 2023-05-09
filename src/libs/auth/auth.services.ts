import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from 'src/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(details: User) {
    const user = await this.userService.findByEmail(details.email);
    if (user) return user;
    const newUser = await this.userService.create(details);
    return newUser;
  }

  async findUser(id: string) {
    const user = await this.userService.findById(id);
    return user;
  }
}
