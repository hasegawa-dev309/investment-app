import { IsString, IsDateString } from 'class-validator';

export class CreateCallStatusDto {
  @IsString()
  current_number: string;

  @IsDateString()
  call_date: string;
} 