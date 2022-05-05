import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { HomeWorkStatusEnum } from '../../enums/enums';
import { Homework } from '../../homework/entities/Homework.entity';

@Entity()
export class SuperviseHomeWork {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  observation: string;

  @Column({
    type: 'enum',
    enum: HomeWorkStatusEnum,
  })
  afterStatus: HomeWorkStatusEnum;

  @Column({
    type: 'enum',
    enum: HomeWorkStatusEnum,
  })
  beforeStatus: HomeWorkStatusEnum;

  @OneToOne(() => User, (user) => user.supervisor)
  user: User;

  /* @ManyToOne(() => Homework, (homework) => homework.superviseHomework)
  public homework!: Homework; */
}
