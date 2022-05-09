import { User } from 'src/auth/entities/user.entity';
import { Homework } from 'src/homework/entities/Homework.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
/* import { Post } from "./post";
import { Category } from "./category"; */

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  public commentId!: number;

  @Column()
  public content: string;

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

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  user: User;

  @ManyToOne(() => Homework, (homeWork) => homeWork.comments)
  homework: Homework;
}
