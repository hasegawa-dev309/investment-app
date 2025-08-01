import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { AgeGroup } from './age-group.entity';
import { Event } from './event.entity';
import { Checkin } from './checkin.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  ticket_number: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'int' })
  people_count: number;

  @Column({ type: 'int' })
  age_group_id: number;

  @Column({ type: 'date' })
  event_date: Date;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @ManyToOne(() => AgeGroup, ageGroup => ageGroup.reservations)
  @JoinColumn({ name: 'age_group_id' })
  ageGroup: AgeGroup;

  @ManyToOne(() => Event, event => event.reservations)
  @JoinColumn({ name: 'event_date' })
  event: Event;

  @OneToOne(() => Checkin, checkin => checkin.reservation)
  checkin: Checkin;
} 