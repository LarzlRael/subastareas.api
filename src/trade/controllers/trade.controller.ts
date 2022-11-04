import {
  Controller,
  Post,
  Param,
  Get,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
  Body,
} from '@nestjs/common';

import { OfferService } from '../../offer/offer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../../utils/utils';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorators/get-user..decorator';
import { User } from '../../auth/entities/user.entity';
import { TradeStatusEnum } from '../../enums/enums';
import { TradeService } from '../services/trade.service';

@Controller('trade')
@UseGuards(AuthGuard('jwt'))
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get('enterPendingTrade/:idOffer')
  enterPendingTrade(@Param('idOffer') idOffer: number) {
    return this.tradeService.enterPendingTrade(idOffer);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  @Put('uploadResolvedHomework/:idOffer')
  uploadResolvedHomework(
    @GetUser() user: User,
    @Param('idOffer') idOffer: number,
    @UploadedFile() homeworkFile: Express.Multer.File,
  ) {
    return this.tradeService.uploadResolvedHomework(
      user,
      idOffer,
      homeworkFile,
    );
  }

  @Get('/acceptTrade/:idOffer')
  acceptTrade(@Param('idOffer') idTradeOffer: number) {
    return this.tradeService.acceptTrade(idTradeOffer);
  }
  @Get('/declineTrade/:idOffer/:reason')
  declineTrade(
    @Param('idOffer') idOffer: number,
    @Param('reason') reason: string,
    @GetUser() user: User,
  ) {
    return this.tradeService.rejectTrade(user, idOffer, reason);
  }

  @Get('offerAcceptedAndUrlResolved/:idOffer')
  offerAcceptedAndUrlResolved(@Param('idOffer') idOffer: number) {
    return this.tradeService.offerAcceptedAndUrlResolved(idOffer);
  }

  @Get('getTradingByUser/:tradeStatus')
  getTradingByUser(
    @GetUser() user: User,
    @Param('tradeStatus') tradeStatus: string,
  ) {
    return this.tradeService.userTradePending(user, tradeStatus);
  }
  @Get('getTradePendingToTrade/')
  userTradePendingToTrade(@GetUser() user: User) {
    return this.tradeService.userTradePendingToTrade(user);
  }
}
