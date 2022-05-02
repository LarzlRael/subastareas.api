import { Homework } from 'src/homework/entities/Homework.entity';
import { Comment } from '../../../comments/entities/comment.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rolName: string;

  @Column({
    default: true,
  })
  active: boolean;

  @ManyToOne((_type) => User, (user) => user.rols)
  user: User;
}
