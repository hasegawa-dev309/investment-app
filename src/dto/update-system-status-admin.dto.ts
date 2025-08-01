import { IsBoolean, IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateSystemStatusAdminDto {
  @IsBoolean()
  is_under_maintenance: boolean;

  @IsString()
  @IsOptional()
  message?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
} 