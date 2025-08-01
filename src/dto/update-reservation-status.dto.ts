import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ReservationStatus } from '../enums/reservation-status.enum';

export class UpdateReservationStatusDto {
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @IsOptional()
  @IsDateString()
  checkin_time?: string;
} 