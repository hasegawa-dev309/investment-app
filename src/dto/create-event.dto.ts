import { IsString, IsInt, IsDateString, Min } from 'class-validator';

export class CreateEventDto {
  @IsDateString()
  event_date: string;

  @IsString()
  event_name: string;

  @IsInt()
  @Min(1)
  max_capacity: number;
} 