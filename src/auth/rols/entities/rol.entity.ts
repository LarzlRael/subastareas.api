import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../entities/user.entity';

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

  @ManyToOne(() => User, (user) => user.rols)
  user: User;
}
