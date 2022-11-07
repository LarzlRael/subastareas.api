import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Transaction } from '.';

@Entity()
export class Withdraw {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dollarValue: number;

  @Column()
  status: string;

  @Column()
  paymentMethod: string;

  @Column()
  accountNumber: string;

  @Column()
  telephone: string;

  @OneToOne(() => Transaction, { eager: true })
  /* @JoinColumn({ name: 'id_professor' }) */
  transaction: Transaction;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
