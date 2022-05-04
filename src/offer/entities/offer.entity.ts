import { Homework } from '../../homework/entities/Homework.entity';
import { User } from '../../auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  priceOffer: number;

  @Column({
    default: false,
  })
  accept: boolean;

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
  homeWork!: Homework;

  @ManyToOne(() => User, (user) => user.offers, { eager: true })
  user!: User;
}
