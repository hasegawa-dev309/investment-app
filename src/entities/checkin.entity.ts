import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity('checkins')
export class Checkin {
  @PrimaryColumn({ type: 'uuid' })
  reservation_id: string;

  @Column({ type: 'varchar', length: 20, default: 'not_arrived' })
  status: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  checked_in_at: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToOne(() => Reservation, reservation => reservation.checkin)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;
} 