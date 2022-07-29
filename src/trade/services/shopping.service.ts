import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shopping } from '../entities/shopping.entity';
import { User } from '../../auth/entities/user.entity';
import { PlanesServices } from './planes.service';
import { WalletService } from '../../wallet/wallet.service';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(Shopping)
    private shoppingRepository: Repository<Shopping>,
    private planesServices: PlanesServices,
    private walletServices: WalletService,
  ) {}

  async buyCoins(user: User, idPlan: number, planName: string) {
    const getPlan = await this.planesServices.getPlan(idPlan);
    const walletUser = await this.walletServices.getWalletByUserId(user.id);

    const pricePlan = getPlan[planName];

    try {
      const shopping = this.shoppingRepository.create({
        user,
        plan: getPlan,
        planName: planName,
        amount: parseInt(planName.substring(4, planName.length)),
        price: pricePlan,
        previousBalance: walletUser.balance,
        currentBalance:
          walletUser.balance + parseInt(planName.substring(4, planName.length)),
      });

      walletUser.balance =
        walletUser.balance + parseInt(planName.substring(4, planName.length));
      this.walletServices.saveWallet(walletUser);
      return await this.shoppingRepository.save(shopping);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
