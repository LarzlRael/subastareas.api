import { TransactionService } from '../services/transaction.service';

import { Controller } from '@nestjs/common';

@Controller('transaction')
/* @UseGuards(AuthGuard('jwt')) */
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
}
