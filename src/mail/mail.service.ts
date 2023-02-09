import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailNotiSale(mails: string[]) {
    for (let i = 0; i < mails.length; i++) {
      await this.mailerService.sendMail({
        to: mails[i],
        from: '"Uniqlo Sale Noti" <support@example.com>', // override default from
        subject: 'Uniqlo Sale Off!',
        template: './notiSale', // `.hbs` extension is appended automatically
        context: {
          url: `https://docs.google.com/spreadsheets/d/${process.env.SHEET_ID}/edit#gid=0`,
        },
      });
    }
  }
}
