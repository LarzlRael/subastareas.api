import { TransactionTypeEnum } from './../../enums/enums';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { Wallet } from '../entities/wallet.entity';
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

  async getUserWithdrawableBalance(user: User) {
    const userBalanceWithDrawable = await this.walletRepository.query(
      `select sum(amount) as balanceWithDrawable from transaction where  walletId = ? and transactionType in (${TransactionTypeEnum.INGRESO},${TransactionTypeEnum.SOLICITUD_RETIRO_COMPLETADO})`,
      [user.wallet.id],
    );

    return userBalanceWithDrawable[0].balanceWithDrawable == null
      ? 0
      : parseInt(userBalanceWithDrawable[0].balanceWithDrawable);
  }
  async getUserBalance(user: User) {
    const userBalance = await this.walletRepository.query(
      'select sum(amount) as balance from transaction where walletId = ?',
      [user.wallet.id],
    );
    return userBalance[0].balance == null
      ? 0
      : parseInt(userBalance[0].balance);
  }
}
