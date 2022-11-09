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
import { WithDrawService } from './withdraw.service';
import { WithDrawDto } from '../dto/withdraw.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    private bankService: BankService /* private planesServices: PlanesServices, */,
    private walletService: WalletService,
    private withDrawService: WithDrawService,
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
      homework: homework,
    });
    const newTransaction = await this.transactionRepository.save(transaction);
    await this.bankService.uploadHomeworkTransaction(newTransaction);
  }

  async updateHomeworkTransaction(
    restorePoints: boolean,
    amount: number,
    homework: Homework,
  ) {
    const getUserWallet = await this.walletService.getWalletByUserId(
      homework.user.id,
    );
    const getTransaction = await this.transactionRepository.findOne({
      where: {
        homework: { id: homework.id },
      },
    });
    if (!getTransaction) {
      throw new InternalServerErrorException();
    }
    if (amount == 0) {
      return;
    }
    delete getTransaction.id;
    if (restorePoints) {
      const createNewTransaction = this.transactionRepository.create({
        ...getTransaction,
        wallet: getUserWallet,
        amount: amount,
      });
      const transaction = await this.transactionRepository.save(
        createNewTransaction,
      );
      await this.bankService.uploadHomeworkTransaction(transaction);
    } else {
      const createNewTransaction = this.transactionRepository.create({
        ...getTransaction,
        wallet: getUserWallet,
        amount: -amount,
      });
      const transaction = await this.transactionRepository.save(
        createNewTransaction,
      );
      await this.bankService.uploadHomeworkTransaction(transaction);
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
  async deleteHomeworkTransaction(homework: Homework) {
    if (!homework.visible) {
      return new InternalServerErrorException(
        "You can't delete a homework that is not visible",
      );
    }
    const userWallet = await this.walletService.getWalletByUserId(
      homework.user.id,
    );
    const transaction = this.transactionRepository.create({
      currencyType: 'BOB',
      transactionType: TransactionTypeEnum.ASEGURADO,
      amount: homework.offered_amount,
      dollarValue: 6.86,
      wallet: userWallet,
      homework: homework,
    });
    const newTransaction = await this.transactionRepository.save(transaction);
    await this.bankService.uploadHomeworkTransaction(newTransaction);
  }

  async withdrawMoneyTransactionRequest(user: User, withDrawDto: WithDrawDto) {
    const getWalletUser = await this.walletService.getWalletByUserId(user.id);
    const userWithDrawableBalance = await this.walletService.getUserWithdrawableBalance(
      user,
    );
    if (userWithDrawableBalance < withDrawDto.amount) {
      throw new InternalServerErrorException(
        'No hay suficiente saldo en tu cuenta',
      );
    } // TODO use the transactions service
    // request to exchange the money from the user wallet to the bank wallet
    const withdrawMoneyTransaction = this.transactionRepository.create({
      currencyType: 'BOB',
      transactionType: TransactionTypeEnum.SOLICITUD_RETIRO,
      amount: 0,
      dollarValue: 6.86,
      withdrawalRequestAmount: withDrawDto.amount,
      wallet: getWalletUser,
    });
    const transaction = await this.transactionRepository.save(
      withdrawMoneyTransaction,
    );
    await this.withDrawService.withDrawRequest(
      user,
      {
        ...withDrawDto,
      },
      transaction,
    );
    this.bankService.withdrawMoneyTransaction(transaction);
    return 'your balance';
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
  async withdrawRequestTransaction(user: User) {
    const getWalletUser = await this.walletService.getWalletByUserId(user.id);
    const withdrawMoneyTransaction = this.transactionRepository.create({
      currencyType: 'BOB',
      transactionType: TransactionTypeEnum.SOLICITUD_RETIRO,
      amount: -getWalletUser.balanceWithDrawable,
      dollarValue: 6.86,
      wallet: getWalletUser,
    });
    const transaction = await this.transactionRepository.save(
      withdrawMoneyTransaction,
    );
    this.bankService.withdrawMoneyTransaction(transaction);
  }

  /* async getUserBalance(user: User) {
    const userBalance = await this.transactionRepository.query(
      'select sum(amount) as balance from transaction where walletId = ?',
      [user.wallet.id],
    );
    return userBalance[0].balance == null
      ? 0
      : parseInt(userBalance[0].balance);
  } */
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

  async getListUserWithdrawRequest() {
    /*  const userBalanceWithDrawable = await this.transactionRepository
      .query(`select t.id, t.created_at ,t.amount ,t.transactionType , u.username ,u.profileImageUrl,u.email ,u.phone from transaction t
    inner join user u
    on t.walletId  = u.id_wallet
    where t.transactionType ='${TransactionTypeEnum.SOLICITUD_RETIRO}' `); */
    const userBalanceWithDrawable = await this.transactionRepository.query(`
      select t.id as 'id_transaction', wi.id as 'id_withdraw',
      t.withdrawalRequestAmount ,t.transactionType, 
      u.username ,u.profileImageUrl,
      u.email, u.phone,
      wi.created_at
      from transaction t
      inner join user u on t.walletId  = u.id_wallet
      inner join withdraw  wi on wi.id_transaction = t.id
      where t.transactionType = '${TransactionTypeEnum.SOLICITUD_RETIRO}'
    `);

    return userBalanceWithDrawable;
  }
  /* async getUserWithdrawableBalance(user: User) {
    const userBalanceWithDrawable = await this.transactionRepository.query(
      'select sum(amount) as balanceWithDrawable from transaction where  walletId = ? and transactionType ="ingreso"',
      [user.wallet.id],
    );

    return userBalanceWithDrawable[0].balanceWithDrawable == null
      ? 0
      : parseInt(userBalanceWithDrawable[0].balanceWithDrawable);
  } */
}
