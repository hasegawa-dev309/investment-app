import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }
    sgMail.setApiKey(apiKey);
  }



  async sendReservationConfirmation(email: string, reservationNumber: string, eventDate: string): Promise<void> {
    const msg = {
      to: email,
      from: this.configService.get('SENDGRID_FROM_EMAIL'),
      subject: `【お化け屋敷受付】予約完了のお知らせ`,
      text: `
お化け屋敷受付システム

予約が完了しました。

整理券番号: ${reservationNumber}
開催日: ${eventDate}

受付開始時にメールでお知らせいたします。
しばらくお待ちください。

---
このメールは自動送信されています。
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('予約確認メール送信エラー:', error);
      throw new Error('メール送信に失敗しました');
    }
  }

  async sendCallNotification(email: string, reservationNumber: string, currentNumber: string): Promise<void> {
    const msg = {
      to: email,
      from: this.configService.get('SENDGRID_FROM_EMAIL'),
      subject: `【お化け屋敷受付】もうすぐお呼び出しです`,
      text: `
お化け屋敷受付システム

もうすぐお呼び出しです。

あなたの整理券番号: ${reservationNumber}
現在呼び出し中の番号: ${currentNumber}

受付にお越しください。

---
このメールは自動送信されています。
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('呼び出し通知メール送信エラー:', error);
      throw new Error('メール送信に失敗しました');
    }
  }
} 