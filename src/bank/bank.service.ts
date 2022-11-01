import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './entities/bank.entity';
import { Transaction } from '../wallet/entities/transaction.entity';
import { TransactionTypeEnum } from '../enums/enums';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
  ) {}
  async buyCoinsTransaction(transaction: Transaction) {
    const newTransaction = this.bankRepository.create({
      ...transaction,
      currencyType: transaction.currencyType,
      amount: -transaction.amount,
      dollarValue: transaction.dollarValue,
      //Question this line is not working correctly

      transactionType: TransactionTypeEnum.EGRESO,
    });
    const newTransactionSaved = await this.bankRepository.save(newTransaction);
    return newTransactionSaved;
  }
  async uploadHomeworkTransaction(transaction: Transaction) {
    const newTransaction = this.bankRepository.create({
      ...transaction,
      currencyType: transaction.currencyType,
      amount: transaction.amount,
      dollarValue: transaction.dollarValue,
      transactionType: TransactionTypeEnum.RETENIDO,
      //wallet del banco
      /* wallet: transaction.wallet, */
    });
    const newTransactionSaved = await this.bankRepository.save(newTransaction);
    return newTransactionSaved;
  }
  async deleteHomeworkTransaction(transaction: Transaction) {
    const newTransaction = this.bankRepository.create({
      ...transaction,
      currencyType: transaction.currencyType,
      amount: transaction.amount,
      dollarValue: transaction.dollarValue,
      transactionType: TransactionTypeEnum.ASEGURADO,
      //wallet del banco
      /* wallet: transaction.wallet, */
    });
    const newTransactionSaved = await this.bankRepository.save(newTransaction);
    return newTransactionSaved;
  }
  async withdrawMoneyTransaction(transaction: Transaction) {
    const newTransaction = this.bankRepository.create({
      ...transaction,
      currencyType: transaction.currencyType,
      amount: transaction.amount,
      dollarValue: transaction.dollarValue,
      transactionType: TransactionTypeEnum.TRASPASO,
      //wallet del banco
      /* wallet: transaction.wallet, */
    });
    const newTransactionSaved = await this.bankRepository.save(newTransaction);
    return newTransactionSaved;
  }
  async exchangeCoinsTransactionByHomeworkResolved(transaction: Transaction) {
    const newTransaction = this.bankRepository.create({
      ...transaction,
      currencyType: transaction.currencyType,
      amount: transaction.amount,
      dollarValue: transaction.dollarValue,
      transactionType: TransactionTypeEnum.TRASPASO,
      //wallet del banco
      /* wallet: transaction.wallet, */
    });
    const newTransactionSaved = await this.bankRepository.save(newTransaction);
    return newTransactionSaved;
  }
}
