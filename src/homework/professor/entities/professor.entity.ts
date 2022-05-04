import { User } from '../../../auth/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Professor {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    default: 0,
  })
  solvedHomeworks: number;

  @Column({
    default: 0,
  })
  reputation: number;

  @OneToOne(() => User, (user) => user.professor)
  user: User;
}
