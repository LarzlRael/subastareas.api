import { OneToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Planes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 1,
  })
  dollarAmount: number;

  @Column({
    nullable: false,
  })
  dateQuery: Date;

  @Column({
    nullable: false,
  })
  currencyType: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false,
    default: 3.1,
  })
  rate: number;

  @Column('decimal', { precision: 8, scale: 2 })
  currencyPriceUSDToday: number;

  @Column('decimal', { precision: 10, scale: 2 })
  currencyPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  googleCommission: number;

  @Column('decimal', { precision: 10, scale: 2 })
  plan200: number;

  @Column('decimal', { precision: 10, scale: 2 })
  plan100: number;

  @Column('decimal', { precision: 10, scale: 2 })
  plan50: number;

  @Column('decimal', { precision: 10, scale: 2 })
  plan25: number;

  @Column('decimal', { precision: 10, scale: 2 })
  plan10: number;

  @Column('decimal', { precision: 10, scale: 2 })
  plan5: number;

  @Column('decimal', { precision: 10, scale: 2 })
  plan1: number;
}
