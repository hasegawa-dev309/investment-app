import { IsBoolean, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateSystemStatusDto {
  @IsBoolean()
  is_under_maintenance: boolean;

  @IsString()
  @IsOptional()
  message?: string;

  @IsDateString()
  status_date: string;
} 