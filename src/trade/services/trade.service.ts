import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HomeWorkStatusEnum, TradeStatusEnum } from '../../enums/enums';
import { NotificationService } from '../../devices/services/notification.service';
import { uploadFile } from '../../utils/utils';
import { User } from '../../auth/entities/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';
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

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async enterPendingTrade(idOffer: number) {
    //verificar si el oferta existe y si el usuario es el dueño de la oferta y la tarea
    const offer = await this.offerService.getOneOffer(idOffer, true);
    if (!offer) {
      throw new Error('Offer not found');
    }
    offer.status = TradeStatusEnum.PENDING_TO_RESOLVE;
    await this.offerService.saveOffer(offer);
    const getHomework = await this.homeworkService.getOneHomeworkAll(
      offer.homework.id,
      true,
    );
    /* const queryRunner = this.tradeRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.manager.save */
    //updating the homework status
    getHomework.status = HomeWorkStatusEnum.PENDING_TO_RESOLVE;
    await this.homeworkService.saveHomework({
      ...getHomework,
    });
    //create the trade with pending to resolve status
    const newTrade = this.tradeRepository.create({
      offer,
      finalAmount: offer.priceOffer,
      status: TradeStatusEnum.PENDING_TO_RESOLVE,
    });
    //TODO Delete some properties, much information is not necessary
    await this.tradeRepository.save(newTrade);
    // send notification to the user that the homework is pending to resolve
    await this.notificationService.sendOfferAcceptedNotification(
      getHomework.user,
      offer,
    );
  }

  async rejectTrade(user: User, idOffer: number, commentTaskRejected: string) {
    const getTrade = await this.tradeRepository.findOne({
      where: {
        offer: {
          id: idOffer,
        },
      },
    });
    const offer = await this.offerService.getOneOffer(idOffer, true);
    const getHomework = await this.homeworkService.getOneHomeworkUser(
      offer.homework.id,
    );
    getHomework.status = HomeWorkStatusEnum.REJECTED_OFFER_HOMEWORK;
    await this.homeworkService.saveHomework(getHomework);
    getTrade.commentTaskRejected = commentTaskRejected;
    getTrade.status = TradeStatusEnum.REJECTED;
    await this.tradeRepository.save(getTrade);
    await this.notificationService.rejectHomeworkNotification(
      user,
      offer,
      commentTaskRejected,
    );
  }
  async acceptTrade(idOffer: number) {
    const offer = await this.offerService.getOneOffer(idOffer, true);
    if (!offer) {
      throw new Error('Offer not found');
    }
    const offerUserWallet = await this.walletService.getWalletByUserId(
      offer.user.id,
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
      where: {
        offer: {
          id: offer.id,
        },
      },
    });
    trade.status = TradeStatusEnum.ACCEPTED;
    await this.tradeRepository.save(trade);
    //Saving the offer status
    offer.status = TradeStatusEnum.ACCEPTED;
    this.offerService.saveOffer(offer);
    //Saving the homework status
    getHomework.status = HomeWorkStatusEnum.TRADED;
    await this.homeworkService.saveHomework(getHomework);

    //Saving add reputation to the user
    await this.professorService.addReputation(offer.user.id, 1);

    this.transactionService.exchangeCoinsTransactionByHomeworkResolved(
      offerUserWallet,
      homeworkUserWallet,
      offer,
    );
    await this.notificationService.sendTradeCompleteSuccessNotification(
      getHomework.user,
      offer,
    );
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
    }
    if (getTrade.offer.user.id !== user.id) {
      throw new InternalServerErrorException(
        'You are not the owner of this offer',
      );
    }
    getOffer.status = TradeStatusEnum.PENDINGTOACCEPT;
    await this.offerService.saveOffer(getOffer);
    //get user owner of this homework
    const getUserHomework = await this.homeworkService.getOneHomeworkAll(
      getOffer.homework.id,
      true,
    );
    // eslint-disable-next-line prettier/prettier
    const homeworkHomeworkDestination = await this.homeworkService.getOneHomeworkAll(
      getOffer.homework.id,
      true,
    );
    await this.homeworkService.saveHomework({
      ...getUserHomework,
      status: HomeWorkStatusEnum.PENDING_TO_ACCEPT,
    });

    await this.notificationService.sendHomeworkResolveNotification(
      getUserHomework.user,
      homeworkHomeworkDestination,
    );

    uploadFile(file, 'SOLVED_HOMEWORK_URL').then(async (url) => {
      await this.tradeRepository.update(getTrade.id, {
        ...getTrade,
        solvedHomeworkUrl: url,
        solvedFileType: file.mimetype,
        status: TradeStatusEnum.PENDINGTOACCEPT,
      });
      return getTrade;
    });
  }

  async userTradePending(user: User, status: string) {
    let verifyStatus = '';
    if (status === 'pending_to_accept') {
      verifyStatus =
        TradeStatusEnum.PENDINGTOACCEPT + ',' + TradeStatusEnum.REJECTED;
      verifyStatus.split(',');
    } else {
      verifyStatus = status;
    }
    const offers = await this.tradeRepository.query(
      `SELECT t.solvedHomeworkUrl,
      t.id as tradeId, h.id as homeworkId,
      t.status,t.solvedFileType,
      t.commentTaskRejected,
      h.title,h.resolutionTime,h.description,
      h.category,
      h.fileUrl, h.fileType,o.id as offerId,
      u.username, u.id ,u.profileImageUrl
      from trade t
      inner join offer o on t.offerId  = o.id
      inner join homework h on h.id = o.homeworkId
      inner join user u on u.id = o.userId
      where h.userId = ? and t.status in(?)
      `,
      [user.id, verifyStatus.split(',')],
    );
    return offers;
  }

  async userTradePendingToTrade(user: User) {
    const offers = await this.tradeRepository.query(
      'SELECT t.solvedHomeworkUrl, t.id as tradeId, h.id  as homeworkId ,t.status, h.title,h.resolutionTime, h.description ,h.fileUrl, h.fileType, o.id as offerId from trade t inner join offer o on t.offerId  = o.id  inner join homework h on h.id = o.homeworkId where o.userId = ? and t.status = "pending_to_trade";',
      [user.id],
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
    return offers;
  }
}
