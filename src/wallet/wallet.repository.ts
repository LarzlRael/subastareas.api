import { Wallet } from './entities/wallet.entity';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@EntityRepository(Wallet)
export class WalletRepository extends Repository<Wallet> {
  async newWallet(user: User): Promise<Wallet> {
    const newWallet = this.create({ user });
    return await this.save(newWallet);
  }
}
