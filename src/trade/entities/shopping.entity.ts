import { OneToOne, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Planes } from './planes.entity';

@Entity()
export class Shopping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.homeworks, { eager: false })
  /* @Exclude({ toPlainOnly: true }) */
  user: User;

  @Column({
    nullable: false,
  })
  planName: string;

  @Column({
    nullable: false,
  })
  amount: number;

  @Column({
    nullable: false,
  })
  previousBalance: number;

  @Column({
    nullable: false,
  })
  currentBalance: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @OneToOne(() => User, (user) => user.supervisor)
  plan: Planes;

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
}
