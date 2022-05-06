import { Homework } from '../../homework/entities/Homework.entity';
import { Supervisor } from '../../homework/supervisor/entities/Supervisor.entity';
import { Rol } from '../rols/entities/rol.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Professor } from '../../homework/professor/entities/professor.entity';
import { Offer } from '../../offer/entities/offer.entity';
import { Device } from '../../devices/entities/devices.entity';
import { Exclude } from 'class-transformer';
export class UserEntity {
  id: number;

  username: string;

  @Exclude()
  password: string;

  name: string;

  lastName: string;

  email: string;

  nickName: string;

  phone: number;

  profileImageUrl: string;

  google: boolean;

  verify: boolean;

  created_at: Date;

  updated_at: Date;

  homeworks: Homework[];

  homeworkSupervisor: Homework[];

  comments: Comment[];

  rols: Rol[];

  supervisor: Supervisor;

  wallet: Wallet;

  professor: Professor;

  offers: Offer[];

  device: Device[];
}
