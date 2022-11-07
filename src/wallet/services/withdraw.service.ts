import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdraw } from '../entities';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { WithDrawDto } from '../dto/withdraw.dto';

@Injectable()
export class WithDrawService {
  constructor(
    @InjectRepository(Withdraw)
    private withdrawRepository: Repository<Withdraw>,
    @InjectRepository(Transaction)
    private transactionService: Repository<Transaction>,
  ) {}
  async createNewTransaction(withDrawDto: WithDrawDto) {
    const getTransaction = await this.transactionService.findOne({
      where: { id: parseInt(withDrawDto.idTransaction) },
    });
    const newTransaction = this.withdrawRepository.create({
      transaction: getTransaction,
      ...withDrawDto,
    });
    await this.withdrawRepository.save(newTransaction);
  }
}
