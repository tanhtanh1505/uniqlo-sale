import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleService } from 'src/helper/googleSheet/google.service';
import { RegisterEmailDto } from './users.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly googleService: GoogleService,
    private mailService: MailService,
  ) {}

  async registerEmail(req: RegisterEmailDto): Promise<string> {
    try {
      const client = await this.googleService.Authorize();
      const sheets = google.sheets({ version: 'v4', auth: client });

      const sheetId = process.env.SHEET_ID;
      const users = await this.googleService.getSheet(sheets, sheetId, 'users');

      if (users && users.length) {
        users.map((user) => {
          if (user[0] == req.email) {
            throw new Error('Email already exists');
          }
        });
        users.push([req.email]);
        await this.googleService.updateSheet(sheets, sheetId, 'users', users);
      } else {
        await this.googleService.updateSheet(sheets, sheetId, 'users', [
          [req.email],
        ]);
      }

      return 'success';
    } catch (error) {
      return error.message;
    }
  }

  async getListRegistedMail(): Promise<string[]> {
    const client = await this.googleService.Authorize();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const sheetId = process.env.SHEET_ID;
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
