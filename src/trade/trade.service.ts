import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HomeWorkStatusEnum, TradeStatusEnum } from '../enums/enums';
import { NotificationService } from '../devices/notification/notification.service';
import { uploadFile } from '../utils/utils';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Trade } from './entities/trade.entity';
import { OfferService } from '../offer/offer.service';
import { HomeworkService } from '../homework/homework.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>,

    private walletService: WalletService,
    private offerService: OfferService,
    private homeworkService: HomeworkService,
    private notificationService: NotificationService,
  ) {}

  async enterPendingTrade(idOffer: number) {
    const offer = await this.offerService.getOneOffer(idOffer);

    if (!offer) {
      throw new Error('Offer not found');
    } else {
      offer.status = TradeStatusEnum.PENDING_TO_RESOLVE;
      await this.offerService.saveOffer(offer);
    }
    const getHomework = await this.homeworkService.getOneHomeworkAll(
      offer.homework.id,
    );
    getHomework.status = HomeWorkStatusEnum.PENDING_TO_RESOLVE;
    await this.homeworkService.saveHomework({
      ...getHomework,
    });

    const newTrade = this.tradeRepository.create({
      offer,
      finalAmount: offer.priceOffer,
      status: TradeStatusEnum.PENDINGTOTRADE,
    });
    this.notificationService.sendOfferAcceptedNotification(
      offer.user,
      getHomework,
    );
    return await this.tradeRepository.save(newTrade);
  }

  async newTrade(idOffer: number) {
    const offer = await this.offerService.getOneOffer(idOffer);

    if (!offer) {
      throw new Error('Offer not found');
    }

    const offerUserWallet = await this.walletService.getWalletByUserId(
      offer.user.wallet.id,
    );
    const homeworkUserWallet = await this.walletService.getWalletByUserId(
      offer.homework.user.wallet.id,
    );

    offerUserWallet.balance = offerUserWallet.balance + offer.priceOffer;
    homeworkUserWallet.balance = homeworkUserWallet.balance - offer.priceOffer;

    await this.walletService.saveWallet(offerUserWallet);
    await this.walletService.saveWallet(homeworkUserWallet);
    return null;
  }
  async uploadResolvedHomework(
    user: User,
    id: number,
    file: Express.Multer.File,
  ) {
    const getOffer = await this.offerService.getOneOffer(id);
    if (!getOffer) {
      throw new InternalServerErrorException('Offer not found');
    }

    const getTrade = await this.tradeRepository.findOne({
      where: {
        offer: {
          id: getOffer.id,
        },
      },
    });

    if (!getTrade) {
      throw new Error('Trade not found');
    } else if (getTrade.offer.user.id !== user.id) {
      throw new InternalServerErrorException(
        'You are not the owner of this offer',
      );
    }
    getOffer.status = TradeStatusEnum.PENDINGTOACCEPT;
    await this.offerService.saveOffer(getOffer);
    //get user owner of this homework
    const getuserHomework = await this.homeworkService.getOneHomeworkAll(
      getOffer.homework.id,
    );
    const homeworkHomeworkDestination =
      await this.homeworkService.getOneHomeworkAll(getOffer.homework.id);

    await this.notificationService.sendHomeworkResolveNotification(
      getuserHomework.user,
      homeworkHomeworkDestination,
    );

    uploadFile(file, 'SOLVED_HOMEWORK_URL').then(async (url) => {
      await this.tradeRepository.update(getTrade.id, {
        ...getTrade,
        solvedHomeworkUrl: url,
        status: TradeStatusEnum.PENDINGTOACCEPT,
      });
      return getTrade;
    });
  }
}
