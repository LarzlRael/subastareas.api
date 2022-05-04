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
import { Professor } from 'src/homework/professor/entities/professor.entity';
import { Offer } from '../../offer/entities/offer.entity';
import { Device } from 'src/devices/entities/devices.entity';

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
    default: false,
  })
  verify: boolean;

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

  @OneToMany(() => Homework, (homeWork) => homeWork.user, { eager: false })
  homeworks: Homework[];

  @OneToMany(() => Comment, (comment) => comment.user, { eager: false })
  comments: Comment[];

  @OneToMany(() => Rol, (rol) => rol.user, { eager: true })
  rols: Rol[];

  @OneToOne(() => Supervisor, { eager: true })
  @JoinColumn({ name: 'id_supervisor' })
  supervisor: Supervisor;

  @OneToOne(() => Professor, { eager: true })
  @JoinColumn({ name: 'id_professor' })
  professor: Professor;

  @OneToMany(() => Offer, (offer) => offer.user, { eager: false })
  offers: Offer[];

  @OneToMany(() => Device, (device) => device.user, { eager: true })
  device: Device[];
}
