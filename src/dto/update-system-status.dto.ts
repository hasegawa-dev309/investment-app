import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class UpdateSystemStatusDto {
  @IsBoolean()
  is_paused: boolean;

  @IsString()
  @IsOptional()
  pause_message?: string;
} 