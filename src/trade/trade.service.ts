import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HomeWorkStatusEnum, TradeStatusEnum } from '../enums/enums';
import { HomeworkRepository } from '../homework/homework.repository';
import { NotificationService } from '../devices/notification/notification.service';
import { uploadFile } from '../utils/utils';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Repository } from 'typeorm';
import { Trade } from './entities/trade.entity';
import { OfferService } from '../offer/offer.service';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private offerService: OfferService,
    private homeworkRepository: HomeworkRepository,
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
    const getHomework = await this.homeworkRepository.findOne(
      offer.homework.id,
    );
    getHomework.status = HomeWorkStatusEnum.PENDING_TO_RESOLVE;
    await this.homeworkRepository.save({
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

    const offerUserWallet = await this.walletRepository.findOne(
      offer.user.wallet.id,
    );
    const homeworkUserWallet = await this.walletRepository.findOne(
      offer.homework.user.wallet.id,
    );

    offerUserWallet.balance = offerUserWallet.balance + offer.priceOffer;
    homeworkUserWallet.balance = homeworkUserWallet.balance - offer.priceOffer;

    await this.walletRepository.save(offerUserWallet);
    await this.walletRepository.save(homeworkUserWallet);
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
      where: { offer: getOffer },
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
    const getuserHomework = await this.homeworkRepository.findOne(
      getOffer.homework.id,
      { relations: ['user'] },
    );
    const homeworkHomeworkDestination = await this.homeworkRepository.findOne(
      getOffer.homework.id,
      { relations: ['user'] },
    );
    console.log(homeworkHomeworkDestination);

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
