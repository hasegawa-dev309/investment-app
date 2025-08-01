import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('administrators')
export class Administrator {
  @PrimaryColumn({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  password_hash: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
} 