import { Homework } from 'src/homework/entities/Homework.entity';
import { User } from '../../auth/entities/user.entity';

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Supervisor {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    default: 0,
  })
  supervisedHomework: number;

  @OneToOne(() => User, (user) => user.supervisor)
  user: User;
}
