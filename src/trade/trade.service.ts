import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TradeRepository } from './trade.repository';
import { OfferRepository } from '../offer/offer.repository';
import { UsersRepository } from '../auth/user.repository';
import { WalletRepository } from '../wallet/wallet.repository';
import { HomeWorkStatusEnum, TradeStatusEnum } from '../enums/enums';
import { HomeworkRepository } from '../homework/homework.repository';
import { NotificationService } from '../devices/notification/notification.service';
import { uploadFile } from '../utils/utils';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TradeService {
  constructor(
    private tradeRepository: TradeRepository,
    private OfferRepository: OfferRepository,
    private walletRepository: WalletRepository,
    private homeworkRepository: HomeworkRepository,
    private notificationService: NotificationService,
  ) {}

  async enterPendingTrade(idOffer: string) {
    const offer = await this.OfferRepository.findOne(idOffer, {
      relations: ['homework'],
    });

    if (!offer) {
      throw new Error('Offer not found');
    } else {
      offer.status = TradeStatusEnum.PENDING_TO_RESOLVE;
      await this.OfferRepository.save(offer);
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

  async newTrade(idOffer: string) {
    const offer = await this.OfferRepository.findOne(idOffer);

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
    const getOffer = await this.OfferRepository.findOne(id, {
      relations: ['homework'],
    });
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
    await this.OfferRepository.save(getOffer);
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
