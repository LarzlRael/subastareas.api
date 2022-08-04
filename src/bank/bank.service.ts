import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { Repository } from 'typeorm';
import { Transaction } from '../wallet/entities/transaction.entity';
import { TransactionTypeEnum } from 'src/enums/enums';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
  ) {}
  async newTransaction(
    transaction: Transaction,
    transactionType: TransactionTypeEnum,
  ) {
    const newTransaction = this.bankRepository.create({
      currencyType: transaction.currencyType,
      transaction,
      amount: transaction.amount,
      balance: transaction.balance,
      dollarValue: transaction.dollarValue,
      //Question this line is not working correctly
      transactionType: transactionType,
    });
    const newTransactionSaved = await this.bankRepository.save(newTransaction);
    return newTransactionSaved;
  }
}
