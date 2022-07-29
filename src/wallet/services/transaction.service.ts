import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planes } from '../../trade/entities/planes.entity';
import axios from 'axios';
import { PriceDollarToday } from '../../interfaces/common';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
}
