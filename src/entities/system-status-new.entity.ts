import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_status_new')
export class SystemStatusNew {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', name: 'is_under_maintenance' })
  is_under_maintenance: boolean;

  @Column({ type: 'varchar', nullable: true })
  message: string;

  @Column({ type: 'date', name: 'status_date' })
  status_date: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
} 