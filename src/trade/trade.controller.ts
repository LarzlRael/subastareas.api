import { Controller, Post, Param } from '@nestjs/common';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}
  @Post('/newTrade/:idOffer')
  newTrade(@Param('idOffer') idOffer: string) {
    return this.tradeService.newTrade(idOffer);
  }
}
