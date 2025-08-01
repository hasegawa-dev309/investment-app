import { Controller, Post, Get, Put, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ReservationNewService } from '../services/reservation-new.service';
import { CreateReservationNewDto } from '../dto/create-reservation-new.dto';
import { UpdateReservationStatusDto } from '../dto/update-reservation-status.dto';
import { ReservationStatus } from '../enums/reservation-status.enum';

@Controller('reservations-new')
export class ReservationNewController {
  constructor(private readonly reservationService: ReservationNewService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReservation(@Body() createReservationDto: CreateReservationNewDto) {
    return this.reservationService.createReservation(createReservationDto);
  }

  @Get('date/:reservationDate')
  async getReservationsByDate(@Param('reservationDate') reservationDate: string) {
    return this.reservationService.getReservationsByDate(reservationDate);
  }

  @Get('date/:reservationDate/number/:reservationNumber')
  async getReservationByNumber(
    @Param('reservationDate') reservationDate: string,
    @Param('reservationNumber') reservationNumber: string,
  ) {
    return this.reservationService.getReservationByNumber(reservationDate, reservationNumber);
  }

  @Put(':id/status')
  async updateReservationStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateReservationStatusDto,
  ) {
    return this.reservationService.updateReservationStatus(parseInt(id), updateStatusDto);
  }

  @Put(':id/cancel')
  async cancelReservation(@Param('id') id: string) {
    return this.reservationService.cancelReservation(parseInt(id));
  }

  @Get('date/:reservationDate/status/:status')
  async getReservationsByStatus(
    @Param('reservationDate') reservationDate: string,
    @Param('status') status: ReservationStatus,
  ) {
    return this.reservationService.getReservationsByStatus(reservationDate, status);
  }
} 