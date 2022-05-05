import { Exclude } from 'class-transformer';
import { User } from 'src/auth/entities/user.entity';
import { UsersRepository } from 'src/auth/user.repository';
import { Comment } from 'src/comments/entities/comment.entity';
import { HomeWorkStatusEnum } from 'src/enums/rol.enum';
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
import { SuperviseHomeWork } from 'src/supervise-homework/entities/superviseHomework..entity';

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
  resolutionTime: Date;

  @Column({
    nullable: true,
  })
  category: string;

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

  @ManyToOne(() => User, (user) => user.homeworks, { eager: true })
  @Exclude({ toPlainOnly: true })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.homework, {
    eager: false,
  })
  comments: Comment[];

  @OneToMany(() => Offer, (offer) => offer.homework, {
    /* eager: true, */
  })
  public offers: Offer[];

  @ManyToOne(() => User, (user) => user.homeworkSupervisor, { eager: true })
  @Exclude({ toPlainOnly: true })
  userSupervisor: User;
}
