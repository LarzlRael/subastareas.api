import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}
  async createWallet(user: User): Promise<Wallet> {
    const newWallet = this.walletRepository.create({ user });
    return await this.walletRepository.save(newWallet);
  }
  async getWalletByUserId(idUser: number) {
    const offerUserWallet = await this.walletRepository.findOne({
      where: { user: { id: idUser } },
    });
    return offerUserWallet;
  }

  async saveWallet(wallet: Wallet) {
    return await this.walletRepository.save(wallet);
  }
}
