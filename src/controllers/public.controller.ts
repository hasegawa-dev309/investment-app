import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ReservationNewService } from '../services/reservation-new.service';
import { CallStatusNewService } from '../services/call-status-new.service';
import { SystemStatusNewService } from '../services/system-status-new.service';
import { CreateReservationNewDto } from '../dto/create-reservation-new.dto';
import { DateUtils } from '../utils/date.utils';

@Controller()
export class PublicController {
  constructor(
    private readonly reservationService: ReservationNewService,
    private readonly callStatusService: CallStatusNewService,
    private readonly systemStatusService: SystemStatusNewService,
  ) {}

  @Post('reserve')
  @HttpCode(HttpStatus.CREATED)
  async createReservation(@Body() createReservationDto: CreateReservationNewDto) {
    return this.reservationService.createReservation(createReservationDto);
  }

  @Get('status')
  async getStatus() {
    const today = DateUtils.getCurrentDate();
    
    // 現在の呼び出し番号を取得
    const callStatus = await this.callStatusService.getCurrentNumber(today);
    
    // システム状態を取得
    const systemStatus = await this.systemStatusService.getSystemStatus(today);
    
    return {
      current_number: callStatus?.current_number || 'A-000',
      is_under_maintenance: systemStatus?.is_under_maintenance || false,
      maintenance_message: systemStatus?.message || '',
      date: today
    };
  }
}