import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdraw } from '../entities';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { WithDrawDto } from '../dto/withdraw.dto';
import { User } from '../../auth/entities/user.entity';
import { WithdrawEnum } from '../../enums/enums';

@Injectable()
export class WithDrawService {
  constructor(
    @InjectRepository(Withdraw)
    private withdrawRepository: Repository<Withdraw>,
    @InjectRepository(Transaction)
    private transactionService: Repository<Transaction>,
  ) {}
  async withDrawRequest(
    user: User,
    withDrawDto: WithDrawDto,
    transaction: Transaction,
  ) {
    const newTransaction = this.withdrawRepository.create({
      transaction,
      ...withDrawDto,
    });
    await this.transactionService.query(
      `
    UPDATE user SET phone = ? WHERE id = ?`,
      [withDrawDto.phone, user.id],
    );

    await this.withdrawRepository.save(newTransaction);
  }
  async completeWithDraw(transaction: Transaction, idWithdraw: number) {
    const getWithdraw = await this.withdrawRepository.findOne({
      where: { id: idWithdraw },
    });
    await this.withdrawRepository.save({
      ...getWithdraw,
      transaction,
      status: WithdrawEnum.PAGADO,
    });
  }
}
