import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity('call_status')
export class CallStatus {
  @PrimaryColumn({ type: 'date' })
  event_date: Date;

  @Column({ type: 'int', default: 0 })
  current_number: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToOne(() => Event, event => event.callStatus)
  @JoinColumn({ name: 'event_date' })
  event: Event;
} 