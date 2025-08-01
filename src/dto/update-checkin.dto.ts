import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateCheckinDto {
  @IsString()
  @IsIn(['not_arrived', 'checked_in', 'no_show'])
  status: string;
} 