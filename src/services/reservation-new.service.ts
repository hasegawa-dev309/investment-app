import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationNew } from '../entities/reservation-new.entity';
import { CreateReservationNewDto } from '../dto/create-reservation-new.dto';
import { UpdateReservationStatusDto } from '../dto/update-reservation-status.dto';
import { ReservationStatus } from '../enums/reservation-status.enum';
import { EmailService } from './email.service';

@Injectable()
export class ReservationNewService {
  constructor(
    @InjectRepository(ReservationNew)
    private reservationRepository: Repository<ReservationNew>,
    private emailService: EmailService,
  ) {}

  async generateNextReservationNumber(reservationDate: string): Promise<string> {
    // 指定日の最大番号を取得
    const maxReservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('MAX(CAST(SUBSTRING(reservation.reservation_number, 3) AS INTEGER))', 'maxNumber')
      .where('reservation.reservation_date = :date', { date: new Date(reservationDate) })
      .andWhere('reservation.reservation_number LIKE :prefix', { prefix: 'A-%' })
      .getRawOne();

    const nextNumber = (maxReservation?.maxNumber || 0) + 1;
    return `A-${nextNumber.toString().padStart(3, '0')}`;
  }

  async createReservation(createReservationDto: CreateReservationNewDto): Promise<ReservationNew> {
    const { reservation_date } = createReservationDto;

    // 予約番号を自動生成
    const reservationNumber = await this.generateNextReservationNumber(reservation_date);

    // 予約作成
    const reservation = this.reservationRepository.create({
      ...createReservationDto,
      reservation_number: reservationNumber,
      reservation_date: new Date(reservation_date),
      status: ReservationStatus.WAITING
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    // 確認メール送信
    try {
      await this.emailService.sendReservationConfirmation(
        savedReservation.email,
        savedReservation.reservation_number,
        reservation_date
      );
    } catch (error) {
      console.error('確認メール送信エラー:', error);
      // メール送信エラーでも予約は作成する
    }

    return savedReservation;
  }

  async getReservationsByDate(reservationDate: string): Promise<ReservationNew[]> {
    return this.reservationRepository.find({
      where: { reservation_date: new Date(reservationDate) },
      order: { created_at: 'ASC' }
    });
  }

  async getReservationByNumber(reservationDate: string, reservationNumber: string): Promise<ReservationNew> {
    const reservation = await this.reservationRepository.findOne({
      where: { 
        reservation_date: new Date(reservationDate), 
        reservation_number: reservationNumber 
      }
    });

    if (!reservation) {
      throw new NotFoundException('予約が見つかりません');
    }

    return reservation;
  }

  async updateReservationStatus(
    id: number, 
    updateStatusDto: UpdateReservationStatusDto
  ): Promise<ReservationNew> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('予約が見つかりません');
    }

    reservation.status = updateStatusDto.status;
    
    if (updateStatusDto.status === ReservationStatus.CHECKED_IN && updateStatusDto.checkin_time) {
      reservation.checkin_time = new Date(updateStatusDto.checkin_time);
    } else if (updateStatusDto.status !== ReservationStatus.CHECKED_IN) {
      reservation.checkin_time = null as any;
    }

    return this.reservationRepository.save(reservation);
  }

  async cancelReservation(id: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('予約が見つかりません');
    }

    reservation.status = ReservationStatus.CANCELED;
    await this.reservationRepository.save(reservation);
  }

  async getReservationsByStatus(reservationDate: string, status: ReservationStatus): Promise<ReservationNew[]> {
    return this.reservationRepository.find({
      where: { 
        reservation_date: new Date(reservationDate), 
        status 
      },
      order: { created_at: 'ASC' }
    });
  }
} 