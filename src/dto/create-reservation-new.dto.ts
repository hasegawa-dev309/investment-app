import { IsEmail, IsInt, IsEnum, IsDateString, Min, Max, Validate } from 'class-validator';
import { AgeGroup } from '../enums/age-group.enum';
import { DateUtils } from '../utils/date.utils';

export class CreateReservationNewDto {
  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(10)
  number_of_people: number;

  @IsEnum(AgeGroup)
  age_group: AgeGroup;

  @IsDateString()
  reservation_date: string;
}