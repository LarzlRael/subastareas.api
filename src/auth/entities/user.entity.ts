import { Homework } from '../../homework/entities/Homework.entity';
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

import { Exclude } from 'class-transformer';
import { Professor } from '../../roles/entities/professor.entity';
import { Supervisor } from '../../roles/entities/Supervisor.entity';
import { Offer } from '../../offer/entities/offer.entity';
import { Device } from '../../devices/entities/devices.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Rol } from '../../roles/entities/rol.entity';
import { Notification } from '../../devices/notification/entities/notification.entity';

@UseInterceptors(ClassSerializerInterceptor)
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
  phone: number;

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

  userRols: string[];
  userDevices: string[];

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

  @OneToMany(() => Homework, (homeWork) => homeWork.userSupervisor, {
    eager: false,
  })
  homeworkSupervisor: Homework[];

  @OneToMany(() => Comment, (comment) => comment.user, { eager: false })
  comments: Comment[];

  @OneToMany(() => Rol, (rol) => rol.user, { eager: true })
  rols: Rol[];

  @OneToOne(() => Supervisor, { eager: false })
  @JoinColumn({ name: 'id_supervisor' })
  supervisor: Supervisor;

  @OneToOne(() => Wallet, { eager: true })
  @JoinColumn({ name: 'id_wallet' })
  wallet: Wallet;

  @OneToOne(() => Professor, { eager: false })
  @JoinColumn({ name: 'id_professor' })
  professor: Professor;

  @OneToMany(() => Offer, (offer) => offer.user, { eager: false })
  offers: Offer[];

  @OneToMany(() => Device, (device) => device.user, { eager: false })
  device: Device[];

  @OneToMany(() => Notification, (notification) => notification.userDestiny, {
    eager: false,
  })
  notification: Notification[];
}
