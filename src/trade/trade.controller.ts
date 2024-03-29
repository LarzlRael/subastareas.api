import {
  Controller,
  Post,
  Param,
  Get,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
} from '@nestjs/common';

import { OfferService } from '../offer/offer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../utils/utils';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user..decorator';
import { User } from '../auth/entities/user.entity';
import { TradeStatusEnum } from '../enums/enums';
import { TradeService } from './services/trade.service';

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
    @UploadedFile() homeworkfile: Express.Multer.File,
  ) {
    return this.tradeService.uploadResolvedHomework(
      user,
      idOffer,
      homeworkfile,
    );
  }

  @Get('/acceptrade/:idTradeOffer')
  acceptTrade(@Param('idTradeOffer') idTradeOffer: number) {
    return this.tradeService.acceptTrade(idTradeOffer);
  }
  @Get('/declinetrade/:idOffer')
  declineTrade(@Param('idOffer') idOffer: number) {
    return this.tradeService.declineTrade(idOffer);
  }

  @Get('offerAcceptedAndUrlResolved/:idOffer')
  offerAcceptedAndUrlResolved(@Param('idOffer') idOffer: number) {
    return this.tradeService.offerAcceptedAndUrlResolved(idOffer);
  }

  @Get('getTradingByuser/:tradestatus')
  getTradingByuser(
    @GetUser() user: User,
    @Param('tradestatus') tradestatus: string,
  ) {
    const userOfferd = this.tradeService.userTradePending(user, tradestatus);
    return userOfferd;
  }
}
