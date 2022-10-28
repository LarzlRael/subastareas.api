import { CreateDateColumn, ManyToOne } from 'typeorm';
import { TransactionTypeEnum } from '../../enums/enums';
import { Wallet } from './wallet.entity';
import { Homework } from '../../homework/entities/Homework.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column()
  amount: number;

  @Column({
    default: 1,
  })
  status: boolean;

  @ManyToOne(() => Wallet, (user) => user.transaction, { eager: false })
  /* @Exclude({ toPlainOnly: true }) */
  wallet: Wallet;

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

  @OneToOne(() => Homework, { eager: true })
  @JoinColumn()
  homework: Homework;
}
