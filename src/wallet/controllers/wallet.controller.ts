import { Controller, Get } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user..decorator';
import { WalletService } from '../services/wallet.service';
import { User } from '../../auth/entities/user.entity';

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
