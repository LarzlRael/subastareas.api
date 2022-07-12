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
import { TradeService } from './trade.service';
import { OfferService } from '../offer/offer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../utils/utils';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user..decorator';
import { User } from '../auth/entities/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('trade')
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

  @Post('/newTrade/:idOffer')
  newTrade(@Param('idOffer') idOffer: number) {
    return this.tradeService.newTrade(idOffer);
  }
}
