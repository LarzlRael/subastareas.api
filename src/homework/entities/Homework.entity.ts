import { Exclude } from 'class-transformer';
import { User } from 'src/auth/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { HomeWorkStatusEnum, LevelTypeEnum } from 'src/enums/enums';
import { Offer } from '../../offer/entities/offer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HomeWorkTypeEnum } from '../../enums/enums';

@Entity()
export class Homework {
  @PrimaryGeneratedColumn()
  id: string;

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
    default: HomeWorkTypeEnum.matematica,
  })
  category: HomeWorkTypeEnum;

  @Column({
    type: 'enum',
    enum: LevelTypeEnum,
    default: LevelTypeEnum.PREUNIVERSITARIO,
  })
  level: LevelTypeEnum;

  @Column({
    nullable: true,
  })
  observation: string;

  @Column({
    type: 'enum',
    enum: HomeWorkStatusEnum,
    default: HomeWorkStatusEnum.PENDING,
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
}
