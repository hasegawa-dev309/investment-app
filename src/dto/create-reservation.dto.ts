import { IsEmail, IsInt, IsString, Min, Max, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  ticket_number: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(10)
  people_count: number;

  @IsInt()
  age_group_id: number;

  @IsDateString()
  event_date: string;
} 