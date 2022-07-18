import { Homework } from '../../homework/entities/Homework.entity';
import { User } from '../../auth/entities/user.entity';
import { OneToOne } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Trade } from '../../trade/entities/trade.entity';
import { TradeStatusEnum } from '../../enums/enums';

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

  @ManyToOne(() => Homework, (homework) => homework.offers)
  homework!: Homework;

  /* eager en true  */
  //TODO
  @ManyToOne(() => User, (user) => user.offers, { eager: false })
  user!: User;

  /* @OneToOne(() => Trade, (trade) => trade.offer)
  offer!: Offer; */
}
