import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ReservationService } from '../services/reservation.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.createReservation(createReservationDto);
  }

  @Get('event/:eventDate')
  async getReservationsByEvent(@Param('eventDate') eventDate: string) {
    return this.reservationService.getReservationsByEvent(eventDate);
  }

  @Get('event/:eventDate/ticket/:ticketNumber')
  async getReservationByTicket(
    @Param('eventDate') eventDate: string,
    @Param('ticketNumber') ticketNumber: string,
  ) {
    return this.reservationService.getReservationByTicket(eventDate, ticketNumber);
  }
} 