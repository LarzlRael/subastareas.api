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

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    private bankService: BankService /* private planesServices: PlanesServices, */,
    private walletService: WalletService,
  ) {}

  async retenerDinero(homework: Homework) {
    // TODO resolve this issue with the get planes services (circular dependency)
    const getUserWallet = await this.walletService.getWalletByUserId(
      homework.user.id,
    );
    const transaction = this.transactionRepository.create({
      currencyType: 'BOB',
      transactionType: TransactionTypeEnum.RETENIDO,
      amount: homework.offered_amount,
      balance: homework.offered_amount,
      dollarValue: 6.86,
      wallet: getUserWallet,
    });
    const newTransaction = await this.transactionRepository.save(transaction);
    this.bankService.newTransaction(
      newTransaction,
      TransactionTypeEnum.RETENIDO,
    );
  }

  async homeworkResolvdedTransaction(
    offerUserWallet: Wallet,
    homeworkUserWallet: Wallet,
    homework: Homework,
  ) {
    // create two transactions for the user and the homework owner
  }

  /* private createTransaction(transaction: Transaction) {
    const createNewTransaction = this.transactionRepository.create({
      currencyType: 'BOB',
      transactionType: TransactionTypeEnum.RETENIDO,
      amount: homework.offered_amount,
      balance: homework.offered_amount,
      dollarValue: 6.86,
      wallet: getUserWallet,
    });
  } */
  async buyCoinsTransaction(
    userWallet: Wallet,
    pricePlan: number,
    getPlan: Planes,
  ) {
    const createNewTransaction = this.transactionRepository.create({
      currencyType: getPlan.currencyType,
      transactionType: TransactionTypeEnum.TRASPASO,
      amount: pricePlan,
      wallet: userWallet.user,
    });
    const transaction = await this.transactionRepository.save(
      createNewTransaction,
    );
    this.bankService.newTransaction(transaction, TransactionTypeEnum.TRASPASO);
  }
  async withdrawMoneyTransaction(walletid: number, withDrawAmount: number) {
    const getWalletUser = await this.walletService.getWalletByUserId(walletid);
    if (getWalletUser.balance < withDrawAmount) {
      throw new InternalServerErrorException(
        'No hay suficiente saldo en tu cuenta',
      );
    } else {
      // TODO use the transactions service
      // request to exchange the money from the user wallet to the bank wallet
      return 'your balance';
    }
  }

  async getUserBalance(user: User) {
    const userBalance = await this.transactionRepository.query(
      'select sum(balance) as balance from transaction where walletId = ?',
      [user.id],
    );
    return userBalance[0];
  }
  async getTransactionsHistory(user: User) {
    const userHistory = await this.transactionRepository.find({
      where: {
        wallet: {
          user: { id: user.id },
        },
      },
    });
    return userHistory;
  }
}
