import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleService } from 'src/helper/googleSheet/google.service';
import { RegisterEmailDto, RegisterEmailResponseDto } from './users.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly googleService: GoogleService,
    private mailService: MailService,
  ) {}

  async registerEmail(
    req: RegisterEmailDto,
  ): Promise<RegisterEmailResponseDto> {
    try {
      const client = await this.googleService.Authorize();
      const sheets = google.sheets({ version: 'v4', auth: client });

      const sheetId = process.env.SHEET_USERS;
      const users = await this.googleService.getSheet(sheets, sheetId, 'users');

      if (users && users.length) {
        users.map((user) => {
          if (user[0] == req.email) {
            throw { message: 'Email already exists' };
          }
        });
        users.push([req.email]);
        await this.googleService.updateSheet(sheets, sheetId, 'users', users);
        await this.mailService.sendMailRegisted(req.email);
      } else {
        await this.googleService.updateSheet(sheets, sheetId, 'users', [
          [req.email],
        ]);
        await this.mailService.sendMailRegisted(req.email);
      }

      return { message: 'Success!' };
    } catch (error) {
      return { message: error.message };
    }
  }

  async getListRegistedMail(): Promise<string[]> {
    const client = await this.googleService.Authorize();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const sheetId = process.env.SHEET_USERS;
    const users = await this.googleService.getSheet(sheets, sheetId, 'users');

    if (users && users.length) {
      return users.map((user) => user[0]);
    }
  }

  async sendMailNotiSale() {
    const mails = await this.getListRegistedMail();
    this.mailService.sendMailNotiSale(mails);
    return 'success';
  }
}
