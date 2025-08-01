import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('call_status_new')
export class CallStatusNew {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'current_number' })
  current_number: string;

  @Column({ type: 'date', name: 'call_date' })
  call_date: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}