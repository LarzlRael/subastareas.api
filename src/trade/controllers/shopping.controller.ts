import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { ShoppingService } from '../services/shopping.service';
import { User } from '../../auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorators/get-user..decorator';

@Controller('shopping')
@UseGuards(AuthGuard('jwt'))
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Get('buyCoins/:idPlan/:planName')
  async buyCoins(
    @GetUser() user: User,
    @Param('idPlan') idPlan: number,
    @Param('planName') planName: string,
  ) {
    return await this.shoppingService.buyCoins(user, idPlan, planName);
  }
}
