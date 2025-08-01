import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { Event } from '../entities/event.entity';
import { AgeGroup } from '../entities/age-group.entity';
import { Checkin } from '../entities/checkin.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { EmailService } from './email.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(AgeGroup)
    private ageGroupRepository: Repository<AgeGroup>,
    @InjectRepository(Checkin)
    private checkinRepository: Repository<Checkin>,
    private emailService: EmailService,
  ) {}

  async createReservation(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const { event_date, age_group_id, ticket_number } = createReservationDto;

    // イベントの存在確認
    const event = await this.eventRepository.findOne({ where: { event_date: new Date(event_date) } });
    if (!event) {
      throw new NotFoundException('指定された日付のイベントが見つかりません');
    }

    // 年齢層の存在確認
    const ageGroup = await this.ageGroupRepository.findOne({ where: { id: age_group_id } });
    if (!ageGroup) {
      throw new NotFoundException('指定された年齢層が見つかりません');
    }

    // チケット番号の重複チェック
    const existingReservation = await this.reservationRepository.findOne({
      where: { event_date: new Date(event_date), ticket_number }
    });
    if (existingReservation) {
      throw new BadRequestException('このチケット番号は既に使用されています');
    }

    // 予約作成
    const reservation = this.reservationRepository.create({
      ...createReservationDto,
      event_date: new Date(event_date)
    });
    const savedReservation = await this.reservationRepository.save(reservation);

    // チェックインレコード作成
    const checkin = this.checkinRepository.create({
      reservation_id: savedReservation.id,
      status: 'not_arrived'
    });
    await this.checkinRepository.save(checkin);

    // 確認メール送信
    try {
      await this.emailService.sendReservationConfirmation(
        savedReservation.email,
        savedReservation.ticket_number,
        event.event_name,
        event_date
      );
    } catch (error) {
      console.error('確認メール送信エラー:', error);
      // メール送信エラーでも予約は作成する
    }

    return savedReservation;
  }

  async getReservationsByEvent(eventDate: string): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { event_date: new Date(eventDate) },
      relations: ['ageGroup', 'checkin'],
      order: { created_at: 'ASC' }
    });
  }

  async getReservationByTicket(eventDate: string, ticketNumber: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { event_date: new Date(eventDate), ticket_number: ticketNumber },
      relations: ['ageGroup', 'checkin', 'event']
    });

    if (!reservation) {
      throw new NotFoundException('予約が見つかりません');
    }

    return reservation;
  }

  async cancelReservation(id: string): Promise<void> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('予約が見つかりません');
    }

    reservation.status = 'cancelled';
    await this.reservationRepository.save(reservation);
  }
} 