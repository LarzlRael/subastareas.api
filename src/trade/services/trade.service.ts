import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HomeWorkStatusEnum, TradeStatusEnum } from '../../enums/enums';
import { NotificationService } from '../../devices/services/notification.service';
import { uploadFile } from '../../utils/utils';
import { User } from '../../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Trade } from '../entities/trade.entity';
import { OfferService } from '../../offer/offer.service';
import { HomeworkService } from '../../homework/homework.service';
import { WalletService } from '../../wallet/services/wallet.service';
import { ProfessorService } from '../../roles/services/professor.service';
import { TransactionService } from '../../wallet/services/transaction.service';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>,

    private readonly offerService: OfferService,
    private readonly homeworkService: HomeworkService,
    private readonly notificationService: NotificationService,
    private readonly professorService: ProfessorService,
    //Wallet Module services
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService,
  ) {}

  async enterPendingTrade(idOffer: number) {
    //verificar si el oferta existe y si el usuario es el dueño de la oferta y la tarea
    const offer = await this.offerService.getOneOffer(idOffer, true);
    console.log(offer);
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
    //TODO Delete some properties, much information is not necessary
    return await this.tradeRepository.save(newTrade);
  }

  async declineTrade(idOffer: number) {}
  async acceptTrade(idOffer: number) {
    const offer = await this.offerService.getOneOffer(idOffer, true);
    /* console.log(offer); */
    if (!offer) {
      throw new Error('Offer not found');
    }
    const offerUserWallet = await this.walletService.getWalletByUserId(
      offer.user.wallet.id,
    );
    // ERROR hasta este punto
    const getHomework = await this.homeworkService.getOneHomeworkUser(
      offer.homework.id,
    );
    const homeworkUserWallet = await this.walletService.getWalletByUserId(
      getHomework.user.id,
    );

    //saving trade status
    const trade = await this.tradeRepository.findOne({
      where: { id: idOffer },
    });
    trade.status = TradeStatusEnum.ACCEPTED;
    await this.tradeRepository.save(trade);
    //Saving the offer status
    offer.status = TradeStatusEnum.ACCEPTED;
    this.offerService.saveOffer(offer);
    //Saving the homework status
    getHomework.status = HomeWorkStatusEnum.TRADED;
    this.homeworkService.saveHomework(getHomework);

    //Saving add reputation to the user
    await this.professorService.addReputation(offer.user.id, 1);

    this.transactionService.exchangeCoinsTransactionByHomeworkResolved(
      offerUserWallet,
      homeworkUserWallet,
      getHomework,
    );
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
      relations: ['offer', 'offer.user', 'offer.homework'],
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
      true,
    );
    // eslint-disable-next-line prettier/prettier
    const homeworkHomeworkDestination = await this.homeworkService.getOneHomeworkAll(
      getOffer.homework.id,
      true,
    );

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

  async userTradePending(user: User, status: string) {
    const offers = await this.tradeRepository.query(
      'SELECT t.solvedHomeworkUrl, t.id as tradeId, h.id as homeworkId ,t.status, h.title,h.resolutionTime,h.description from trade t inner join offer o on t.offerId  = o.id inner join homework h on h.id = o.homeworkId where h.userId = ? and t.status = ?',
      [user.id, status],
    );
    return offers;
  }

  async offerAcceptedAndUrlResolved(idTrade: number) {
    const getTrade = await this.tradeRepository.findOne({
      where: {
        id: idTrade,
      },
    });
    if (!getTrade) {
      throw new InternalServerErrorException('Trade not found');
    }

    const offers = await this.tradeRepository.query(
      'SELECT t.solvedHomeworkUrl, t.id as tradeId,h.id, h.title,h.resolutionTime,h.description from trade t inner join offer o on t.offerId  = o.id inner join homework h on h.id = o.homeworkId where t.id = ?',
      [idTrade],
    );
    console.log(offers);
    return offers;
  }
}
