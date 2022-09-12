import { define } from 'typeorm-seeding';
import { User } from '../../auth/entities/user.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

define(User, () => {
  const user = new User();
  user.name = 'administra';
  user.username = 'administra';
  user.password = '123456';
  user.email = 'admin@subastareas.com';
  user.verify = true;
  user.profileImageUrl =
    'https://negocioexitoso.online/subastareas/wp-content/uploads/sites/6/2022/06/logo-for-dark-256x32.png';

  return user;
});
