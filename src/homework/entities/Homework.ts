import { Exclude } from 'class-transformer';
import { User } from 'src/auth/entities/User';
import { UsersRepository } from 'src/auth/user.repository';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class HomeWork {
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

  @ManyToOne((_type) => User, (user) => user.homeworks, { eager: true })
  @Exclude({ toPlainOnly: true })
  user: User;
}
