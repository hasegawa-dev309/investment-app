import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CallStatusNew } from '../entities/call-status-new.entity';
import { CreateCallStatusDto } from '../dto/create-call-status.dto';
import { EmailService } from './email.service';
import { ReservationNewService } from './reservation-new.service';

@Injectable()
export class CallStatusNewService {
  constructor(
    @InjectRepository(CallStatusNew)
    private callStatusRepository: Repository<CallStatusNew>,
    private emailService: EmailService,
    private reservationService: ReservationNewService,
  ) {}

  async getCurrentNumber(callDate: string): Promise<CallStatusNew | null> {
    return this.callStatusRepository.findOne({
      where: { call_date: new Date(callDate) }
    });
  }

  async updateCurrentNumber(callDate: string, currentNumber: string): Promise<CallStatusNew> {
    let callStatus = await this.callStatusRepository.findOne({
      where: { call_date: new Date(callDate) }
    });

    if (!callStatus) {
      // 新しい日付の場合は新規作成
      callStatus = this.callStatusRepository.create({
        current_number: currentNumber,
        call_date: new Date(callDate)
      });
    } else {
      // 既存の場合は更新
      callStatus.current_number = currentNumber;
    }

    const savedCallStatus = await this.callStatusRepository.save(callStatus);

    // 10組前の予約者に通知メールを送信
    await this.sendNotificationsToUpcomingReservations(callDate, currentNumber);

    return savedCallStatus;
  }

  async advanceNumber(callDate: string): Promise<CallStatusNew> {
    const callStatus = await this.getCurrentNumber(callDate);
    if (!callStatus) {
      throw new NotFoundException('指定された日付の呼び出し番号が見つかりません');
    }

    // 現在の番号を進める（例：A-001 → A-002）
    const [prefix, numberStr] = callStatus.current_number.split('-');
    const currentNumber = parseInt(numberStr);
    const nextNumber = currentNumber + 1;
    const nextNumberStr = nextNumber.toString().padStart(3, '0');
    const newCurrentNumber = `${prefix}-${nextNumberStr}`;

    return this.updateCurrentNumber(callDate, newCurrentNumber);
  }

  private async sendNotificationsToUpcomingReservations(callDate: string, currentNumber: string): Promise<void> {
    try {
      // 現在の番号から数値を抽出（例：A-012 → 12）
      const [prefix, numberStr] = currentNumber.split('-');
      const currentNumberInt = parseInt(numberStr);
      
      // 10組前の番号を計算
      const upcomingNumber = currentNumberInt + 10;
      const upcomingNumberStr = upcomingNumber.toString().padStart(3, '0');
      const upcomingReservationNumber = `${prefix}-${upcomingNumberStr}`;

      // 10組前の予約を検索
      const upcomingReservation = await this.reservationService.getReservationByNumber(
        callDate, 
        upcomingReservationNumber
      );

      if (upcomingReservation) {
        // もうすぐ呼び出しメールを送信
        await this.emailService.sendCallNotification(
          upcomingReservation.email,
          upcomingReservation.reservation_number,
          currentNumber
        );
        console.log(`10組前通知メール送信: ${upcomingReservationNumber} → ${upcomingReservation.email}`);
      }
    } catch (error) {
      console.error('10組前通知メール送信エラー:', error);
      // エラーが発生しても呼び出し番号の更新は続行
    }
  }
} 