import { Controller, Get } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from '../../auth/decorators/get-user..decorator';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @Get('/getWithdrawableBalance/')
  async obtainWithdrawableBalance(@GetUser() user: User) {
    return this.walletService.getUserWithdrawableBalance(user);
  }
  @Get('/getUserBalance')
  async getUserBalance(@GetUser() user: User) {
    return this.walletService.getUserBalance(user);
  }
}
