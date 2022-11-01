import { define } from 'typeorm-seeding';
import { User } from '../../auth/entities/user.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

define(User, () => {
  const user = new User();
  user.name = 'administra';
  user.password = '123456';
  user.username = 'administra';
  user.lastName = 'administra';
  user.nickName = 'administra';
  user.email = 'admin@subastareas.com';
  user.verify = true;
  user.profileImageUrl =
    'https://www.terra.com/u/fotografias/m/2022/8/8/f800x450-1813_53259_5050.jpg';

  return user;
});
