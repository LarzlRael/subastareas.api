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

  @Column({
    default: 'pendiente_a_pagar',
  })
  status: string;

  @Column({
    nullable: true,
  })
  paymentMethod: string;

  @Column({
    nullable: true,
  })
  accountNumber: string;

  @OneToOne(() => Transaction, { eager: true })
  @JoinColumn({ name: 'id_transaction' })
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
