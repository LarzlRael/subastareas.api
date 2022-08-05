import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Transaction, Wallet } from '../../wallet/entities/';
import { TransactionTypeEnum } from '../../enums/enums';

@Entity()
export class Bank {
  @PrimaryGeneratedColumn()
  id: number;

  /* @Column({
    default: 0,
  })
  balance: number;
 */
  @Column()
  dollarValue: number;

  @Column()
  currencyType: string;

  @Column({
    type: 'enum',
    enum: TransactionTypeEnum,
    default: TransactionTypeEnum.ASEGURADO,
  })
  transactionType: TransactionTypeEnum;

  @OneToOne(() => Wallet)
  @JoinColumn()
  walletOrigin: Wallet;

  @OneToOne(() => Wallet)
  @JoinColumn()
  walletDestiny: Wallet;

  @Column()
  amount: number;

  @OneToOne(() => Transaction)
  @JoinColumn()
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

  balance: number;
}
