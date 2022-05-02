import { Homework } from 'src/homework/entities/Homework.entity';
import { Comment } from '../../comments/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rol } from '../rols/entities/rol.entity';
import { Supervisor } from 'src/homework/supervisor/entities/Supervisor.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  nickName: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  profileImageUrl: string;

  @Column({
    default: false,
  })
  google: boolean;

  @Column({
    nullable: true,
  })

  @Column({
    default: false,
  })
  verify: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @OneToMany((_type) => Homework, (homeWork) => homeWork.user, { eager: false })
  homeworks: Homework[];

  @OneToMany((_type) => Comment, (comment) => comment.user, { eager: false })
  comments: Comment[];

  @OneToMany((_type) => Rol, (rol) => rol.user, { eager: true })
  rols: Rol[];

  @OneToOne(() => Supervisor)
  @JoinColumn({ name: 'id_supervisor' })
  supervisor: Supervisor;
}
