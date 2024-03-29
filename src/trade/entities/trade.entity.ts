import { OneToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TradeStatusEnum } from '../../enums/enums';
import { Offer } from '../../offer/entities/offer.entity';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  finalAmount: number;

  @Column({ nullable: true })
  solvedHomeworkUrl: string;

  @Column({
    type: 'enum',
    enum: TradeStatusEnum,
    default: TradeStatusEnum.PENDINGTOTRADE,
  })
  status: TradeStatusEnum;

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

  // ver si causa problemas  a futuro
  @OneToOne(() => Offer, { eager: false })
  @JoinColumn()
  offer: Offer;
}
