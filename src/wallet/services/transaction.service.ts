import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { BankService } from '../../bank/bank.service';
import { Homework } from '../../homework/entities/Homework.entity';
import { PlanesServices } from '../../trade/services/planes.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    private bankService: BankService,
    /* private planesServices: PlanesServices, */
  ) {}

  async retenerDinero(Homework: Homework) {
    /* const planes = await this.planesServices.getPlanes(); */
    /* const transaction = this.transactionRepository.create({
      type: 'RETENER',
      status: 'PENDING',
    }); */
  }
}
