import { Injectable } from '@nestjs/common';
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

    const getHomework = await this.homeworkRepository.findOne(
      offer.homework.id,
    );
    getHomework.status = HomeWorkStatusEnum.PENDING_TO_RESOLVE;
    await this.homeworkRepository.save({
      ...getHomework,
    });
    if (!offer) {
      throw new Error('Offer not found');
    }

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
    console.log(offer);
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
    const homework = await this.tradeRepository.findOne(id);
    uploadFile(file, 'SOLVED_HOMEWORK_URL').then(async (url) => {
      await this.tradeRepository.update(id, {
        ...homework,
        solvedHomeworkUrl: url,
        status: TradeStatusEnum.PENDINGTOACCEPT,
      });
      return homework;
    });
  }
}
