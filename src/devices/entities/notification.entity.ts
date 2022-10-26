import { CreateDateColumn, ManyToOne } from 'typeorm';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { TypeNotificationEnum } from '../../enums/enums';

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
    default: 0,
  })
  offerAmount: number;

  @Column({
    default: true,
  })
  notified: boolean;

  @Column({
    default: false,
  })
  seen: boolean;

  @Column()
  idHomework: number;

  @Column()
  idOffer: number;

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

  @ManyToOne(() => User, (user) => user.notification, { eager: false })
  userOrigin: User;

  @ManyToOne(() => User, (user) => user.notification, { eager: false })
  userDestiny: User;
}
