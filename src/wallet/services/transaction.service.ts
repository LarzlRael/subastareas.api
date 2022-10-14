import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { BankService } from '../../bank/bank.service';
import { Homework } from '../../homework/entities/Homework.entity';
import { PlanesServices } from '../../trade/services/planes.service';

import { WalletService } from './wallet.service';
import { Wallet } from '../entities/wallet.entity';
import { User } from '../../auth/entities/user.entity';
import { Planes } from '../../trade/entities/planes.entity';
import { TransactionTypeEnum } from '../../enums/enums';
import { Shopping } from '../../trade/entities/shopping.entity';
import { Offer } from '../../offer/entities/offer.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    private bankService: BankService /* private planesServices: PlanesServices, */,
    private walletService: WalletService,
  ) {}

  async uploadHomeworkTransaction(homework: Homework) {
    // TODO resolve this issue with the get planes services (circular dependency)
    const getUserWallet = await this.walletService.getWalletByUserId(
      homework.user.id,
    );
    const transaction = this.transactionRepository.create({
      currencyType: 'BOB',
      transactionType: TransactionTypeEnum.RETENIDO,
      amount: -homework.offered_amount,
      dollarValue: 6.86,
      wallet: getUserWallet,
    });
    const newTransaction = await this.transactionRepository.save(transaction);
    await this.bankService.uploadHomeworkTransaction(newTransaction);
  }

  async updateHomeworkTransaction(
    pay: boolean,
    amount: number,
    homework: Homework,
  ) {
    if (!pay) {
      this.uploadHomeworkTransaction(homework);
    }
  }
  async buyCoinsTransaction(
    userWallet: Wallet,
    amount: number,
    getPlan: Planes,
  ) {
    const createNewTransaction = this.transactionRepository.create({
      currencyType: getPlan.currencyType,
      transactionType: TransactionTypeEnum.TRASPASO,
      amount: amount,
      wallet: userWallet,
      dollarValue: getPlan.currencyPriceUSDToday,
    });
    const transaction = await this.transactionRepository.save(
      createNewTransaction,
    );
    await this.bankService.buyCoinsTransaction(transaction);
  }
  async withdrawMoneyTransactionRequest(
    walletId: number,
    withDrawAmount: number,
  ) {
    const getWalletUser = await this.walletService.getWalletByUserId(walletId);
    if (getWalletUser.balanceWithDrawable < withDrawAmount) {
      throw new InternalServerErrorException(
        'No hay suficiente saldo en tu cuenta',
      );
    } else {
      // TODO use the transactions service
      // request to exchange the money from the user wallet to the bank wallet
      const withdrawMoneyTransaction = this.transactionRepository.create({
        currencyType: 'BOB',
        transactionType: TransactionTypeEnum.SOLICITUD_RETIRO,
        amount: -withDrawAmount,
        dollarValue: 6.86,
        wallet: getWalletUser,
      });
      const transaction = await this.transactionRepository.save(
        withdrawMoneyTransaction,
      );
      this.bankService.withdrawMoneyTransaction(transaction);
      return 'your balance';
    }
  }

  async exchangeCoinsTransactionByHomeworkResolved(
    userOrigin: Wallet,
    userDestiny: Wallet,
    offer: Offer,
  ) {
    const exchangeCoinsDestinyUser = this.transactionRepository.create({
      currencyType: 'BOB',
      transactionType: TransactionTypeEnum.INGRESO,
      amount: offer.priceOffer,
      dollarValue: 6.86,
      wallet: userDestiny,
    });
    const transactionDestinyUser = await this.transactionRepository.save(
      exchangeCoinsDestinyUser,
    );
    //TODO bank service using the copy of the transaction

    const exchangeCoinsOriginUser = this.transactionRepository.create({
      currencyType: 'BOB',
      transactionType: TransactionTypeEnum.INGRESO,
      amount: -offer.priceOffer,
      dollarValue: 6.86,
      wallet: userOrigin,
    });
    const transactionOriginUser = await this.transactionRepository.save(
      exchangeCoinsOriginUser,
    );
    //TODO the 2 in bank service using the copy of the transaction
    // tipo egreso en el banco y tipo ingreso en el usuario
    this.bankService.exchangeCoinsTransactionByHomeworkResolved(
      exchangeCoinsOriginUser,
    );
  }

  async getUserBalance(user: User) {
    const userBalance = await this.transactionRepository.query(
      'select sum(amount) as balance from transaction where walletId = ?',
      [user.wallet.id],
    );
    return userBalance[0].balance == null
      ? 0
      : parseInt(userBalance[0].balance);
  }
  async getTransactionsHistory(user: User) {
    const userHistory = await this.transactionRepository.find({
      where: {
        wallet: {
          user: { id: user.id },
        },
      },
      order: {
        id: 'DESC',
      },
    });
    return userHistory;
  }

  async getUserWithdrawableBalance(user: User) {
    const userBalanceWithDrawable = await this.transactionRepository.query(
      'select sum(amount) as balanceWithDrawable from transaction where  walletId = ? and transactionType ="ingreso"',
      [user.wallet.id],
    );

    return userBalanceWithDrawable[0].balanceWithDrawable == null
      ? 0
      : parseInt(userBalanceWithDrawable[0].balanceWithDrawable);
  }
}
