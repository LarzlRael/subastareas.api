import { OneToOne, CreateDateColumn, ManyToOne } from 'typeorm';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Offer } from 'src/offer/entities/offer.entity';
import { TradeStatusEnum, TypeNotificationEnum } from 'src/enums/enums';
import { User } from '../../../auth/entities/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: string;

  // change to enum
  @Column({
    type: 'enum',
    enum: TypeNotificationEnum,
  })
  type: TypeNotificationEnum;

  @Column({
    default: true,
  })
  visible: boolean;

  @Column({
    default: false,
  })
  seen: boolean;

  @Column()
  content: string;

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

  @ManyToOne(() => User, (user) => user.homeworks, { eager: false })
  user: User;
}
