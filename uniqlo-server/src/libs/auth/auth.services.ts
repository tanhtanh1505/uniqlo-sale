import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from 'src/entity/user.entity';
import { OAuth2Client } from 'google-auth-library';
import { Role } from 'src/utils/roles/role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  async signIn(req) {
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    const ticket = await client.verifyIdToken({
      idToken: req.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let user = await this.userService.findByEmail(payload.email);
    if (!user) {
      user = await this.userService.create({
        email: payload.email,
        displayName: payload.name,
        roles: [Role.User],
      });
    }

    return {
      email: user.email,
      displayName: user.displayName,
      roles: user.roles,
      image: payload.picture,
      access_token: await this.jwtService.signAsync({
        id: user._id,
      }),
    };
  }
}
