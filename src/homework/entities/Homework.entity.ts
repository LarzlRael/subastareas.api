import { Exclude } from 'class-transformer';
import { User } from '../../auth/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { HomeWorkStatusEnum, LevelTypeEnum } from '../../enums/enums';
import { Offer } from '../../offer/entities/offer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HomeWorkTypeEnum } from '../../enums/enums';
import { Transaction } from '../../wallet/entities/transaction.entity';

@Entity()
export class Homework {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    default: 0,
  })
  offered_amount: number;

  @Column({
    nullable: true,
  })
  fileUrl: string;
  @Column({
    nullable: true,
  })
  fileType: string;

  @Column({ type: 'timestamp' })
  resolutionTime: Date;

  @Column({
    type: 'enum',
    enum: HomeWorkTypeEnum,
    default: HomeWorkTypeEnum.MATEMATICA,
  })
  category: HomeWorkTypeEnum;

  @Column({
    nullable: true,
  })
  subCategory: string;

  @Column({
    nullable: true,
  })
  observation: string;
  @Column({
    default: true,
  })
  visible: boolean;

  @Column({
    type: 'enum',
    enum: HomeWorkStatusEnum,
    default: HomeWorkStatusEnum.PENDING_TO_ACCEPT,
  })
  status: HomeWorkStatusEnum;

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
  @Exclude({ toPlainOnly: true })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.homework, {
    eager: false,
  })
  comments: Comment[];

  @OneToMany(() => Offer, (offer) => offer.homework, {
    eager: false,
  })
  public offers: Offer[];

  @ManyToOne(() => User, (user) => user.homeworkSupervisor, { eager: false })
  @Exclude({ toPlainOnly: true })
  userSupervisor: User;

  @OneToOne(() => Transaction, (transaction) => transaction.homework)
  transaction: Transaction;
}
