import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Favorite } from 'src/entity/favorite.entity';
import { FavoriteScanResDto } from 'src/libs/favorites/favorites.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailNotiSale(detail: FavoriteScanResDto) {
    if (detail.user.remainingMail <= 0) {
      return;
    }

    const products = detail.saleCloths.map((cloth) => {
      return {
        code: cloth.code,
        color: cloth.color,
        size: cloth.size,
        price: cloth.price,
      };
    });

    await this.mailerService.sendMail({
      to: detail.user.email,
      from: '"Uniqlo Sale Noti" <support@example.com>',
      subject: 'Uniqlo Sale Off!',
      template: './notiSale',
      context: {
        name: detail.user.displayName,
        products: products,
        sheet: `https://docs.google.com/spreadsheets/d/${process.env.SHEET_CLOTHES}/edit#gid=0`,
        web: process.env.WEB_HOST,
      },
    });
  }

  async sendMailRegisted(mail: string) {
    await this.mailerService.sendMail({
      to: mail,
      from: '"Uniqlo Sale Noti" <support@example.com>',
      subject: 'Register success!',
      template: './register',
      context: {
        url: process.env.WEB_HOST,
      },
    });
  }
}
