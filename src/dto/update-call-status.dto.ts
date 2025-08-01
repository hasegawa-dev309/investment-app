import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateCallStatusDto {
  @IsString()
  current_number: string;

  @IsOptional()
  @IsDateString()
  date?: string;
} 