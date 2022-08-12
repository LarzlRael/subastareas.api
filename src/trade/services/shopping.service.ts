import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shopping } from '../entities/shopping.entity';
import { User } from '../../auth/entities/user.entity';
import { PlanesServices } from './planes.service';
import { WalletService } from '../../wallet/services/wallet.service';
import { TransactionService } from '../../wallet/services/transaction.service';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(Shopping)
    private shoppingRepository: Repository<Shopping>,
    private planesServices: PlanesServices,
    private walletServices: WalletService,
    private transactionService: TransactionService,
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
        previousBalance: walletUser.balanceTotal,
        currentBalance:
          walletUser.balanceTotal +
          parseInt(planName.substring(4, planName.length)),
      });

      /* TODO use the transactions service */
      await this.transactionService.buyCoinsTransaction(
        walletUser,
        parseInt(planName.substring(4, planName.length)),
        getPlan,
      );
      return await this.shoppingRepository.save(shopping);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
