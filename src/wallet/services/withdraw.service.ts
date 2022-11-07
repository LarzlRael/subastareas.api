import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdraw } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class WithDrawService {
  constructor(
    @InjectRepository(Withdraw)
    private transactionRepository: Repository<Withdraw>,
  ) {}
}
