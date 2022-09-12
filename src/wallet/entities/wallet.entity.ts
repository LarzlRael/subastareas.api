import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 0,
  })
  balanceTotal: number;
  @Column({
    default: 0,
  })
  balanceWithDrawable: number;

  @OneToOne(() => User, (user) => user.wallet)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet, {
    eager: false,
  })
  transaction: Transaction[];

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
