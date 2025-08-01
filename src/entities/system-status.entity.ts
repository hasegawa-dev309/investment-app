import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity('system_status')
export class SystemStatus {
  @PrimaryColumn({ type: 'date' })
  event_date: Date;

  @Column({ type: 'boolean', default: false })
  is_paused: boolean;

  @Column({ type: 'text', default: '' })
  pause_message: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToOne(() => Event, event => event.systemStatus)
  @JoinColumn({ name: 'event_date' })
  event: Event;
} 