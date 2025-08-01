import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AgeGroup } from '../enums/age-group.enum';
import { ReservationStatus } from '../enums/reservation-status.enum';

@Entity('reservations_new')
export class ReservationNew {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'int', name: 'number_of_people' })
  number_of_people: number;

  @Column({
    type: 'enum',
    enum: AgeGroup,
    name: 'age_group'
  })
  age_group: AgeGroup;

  @Column({ type: 'varchar', name: 'reservation_number' })
  reservation_number: string;

  @Column({ type: 'date', name: 'reservation_date' })
  reservation_date: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.WAITING
  })
  status: ReservationStatus;

  @Column({ type: 'timestamp', nullable: true, name: 'checkin_time' })
  checkin_time: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}