import { Homework } from '../../homework/entities/Homework.entity';
import { User } from '../../auth/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TradeStatusEnum } from '../../enums/enums';
import { Trade } from '../../trade/entities';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  priceOffer: number;

  @Column({
    type: 'enum',
    enum: TradeStatusEnum,
    default: TradeStatusEnum.PENDING,
  })
  status: TradeStatusEnum;

  @Column({
    default: false,
  })
  edited: boolean;

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

  @ManyToOne(() => Homework, (homework) => homework.offers, { eager: false })
  homework!: Homework;

  @ManyToOne(() => User, (user) => user.offers, { eager: false })
  user!: User;

  @OneToOne(() => Trade, (trade) => trade.offer, { eager: false })
  offer!: Offer;
}
