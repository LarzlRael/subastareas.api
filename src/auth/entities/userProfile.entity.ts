import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.userProfile)
  user: User;

  @Column({
    default: true,
  })
  receiveNotifications: boolean;

  @Column({
    default: false,
  })
  isDarkTheme: boolean;

  @Column({
    nullable: true,
  })
  bio: string;
}
