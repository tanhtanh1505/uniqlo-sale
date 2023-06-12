import { Module } from '@nestjs/common';
import { AuthService } from './auth.services';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './utils/google.stratege';
import { SessionSerializer } from './utils/serializer';
import { JwtModule } from '@nestjs/jwt';
import { secret } from '../../utils/keys/jwt.json';
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
