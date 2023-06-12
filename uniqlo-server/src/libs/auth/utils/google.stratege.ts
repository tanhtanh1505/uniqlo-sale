import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.services';
import ClientSecret from '../../../utils/keys/client_secret.json';
import { Role } from 'src/utils/roles/role.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: ClientSecret.web.client_id,
      clientSecret: ClientSecret.web.client_secret,
      callbackURL: ClientSecret.web.redirect_uris[0],
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile);
    const user = await this.authService.validateUser({
      email: profile.emails[0].value,
      displayName: profile.displayName,
      roles: [Role.User],
    });
    // console.log('Validate');
    // console.log(user);
    return user || null;
  }
}
