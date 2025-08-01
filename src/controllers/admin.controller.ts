import { Controller, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { ReservationNewService } from '../services/reservation-new.service';
import { CallStatusNewService } from '../services/call-status-new.service';
import { SystemStatusNewService } from '../services/system-status-new.service';
import { UpdateReservationStatusDto } from '../dto/update-reservation-status.dto';
import { UpdateCallStatusDto } from '../dto/update-call-status.dto';
import { UpdateSystemStatusAdminDto } from '../dto/update-system-status-admin.dto';
import { DateUtils } from '../utils/date.utils';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly reservationService: ReservationNewService,
    private readonly callStatusService: CallStatusNewService,
    private readonly systemStatusService: SystemStatusNewService,
  ) {}

  @Get('reservations')
  async getReservations(@Query('date') date?: string) {
    const targetDate = date || DateUtils.getCurrentDate();
    return this.reservationService.getReservationsByDate(targetDate);
  }

  @Patch('call-status')
  async updateCallStatus(@Body() updateCallStatusDto: UpdateCallStatusDto) {
    const targetDate = updateCallStatusDto.date || DateUtils.getCurrentDate();
    return this.callStatusService.updateCurrentNumber(targetDate, updateCallStatusDto.current_number);
  }

  @Patch('checkin/:id')
  async updateCheckin(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateReservationStatusDto,
  ) {
    return this.reservationService.updateReservationStatus(parseInt(id), updateStatusDto);
  }

  @Patch('system-status')
  async updateSystemStatus(@Body() updateSystemStatusDto: UpdateSystemStatusAdminDto) {
    const targetDate = updateSystemStatusDto.date || DateUtils.getCurrentDate();
    return this.systemStatusService.updateSystemStatus(
      targetDate, 
      updateSystemStatusDto.is_under_maintenance, 
      updateSystemStatusDto.message
    );
  }
} 