import { Controller, Post, Param, Get } from '@nestjs/common';
import { TradeService } from './trade.service';
import { OfferService } from '../offer/offer.service';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get('enterPendingTrade/:idOffer')
  enterPendingExchange(@Param('idOffer') idOffer: string) {
    return this.tradeService.enterPendingTrade(idOffer);
  }

  @Post('/newTrade/:idOffer')
  newTrade(@Param('idOffer') idOffer: string) {
    return this.tradeService.newTrade(idOffer);
  }
}
