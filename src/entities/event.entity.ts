import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CallStatus } from './call-status.entity';
import { SystemStatus } from './system-status.entity';

@Entity('events')
export class Event {
  @PrimaryColumn({ type: 'date' })
  event_date: Date;

  @Column({ type: 'varchar', length: 100 })
  event_name: string;

  @Column({ type: 'int' })
  max_capacity: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => Reservation, reservation => reservation.event)
  reservations: Reservation[];

  @OneToOne(() => CallStatus, callStatus => callStatus.event)
  callStatus: CallStatus;

  @OneToOne(() => SystemStatus, systemStatus => systemStatus.event)
  systemStatus: SystemStatus;
} 