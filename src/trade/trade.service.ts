import { Injectable } from '@nestjs/common';
import { TradeRepository } from './trade.repository';
import { OfferRepository } from '../offer/offer.repository';
import { UsersRepository } from '../auth/user.repository';
import { WalletRepository } from '../wallet/wallet.repository';
import { TradeStatusEnum } from '../enums/enums';

@Injectable()
export class TradeService {
  constructor(
    private tradeRepository: TradeRepository,
    private OfferRepository: OfferRepository,
    private userRepository: UsersRepository,
    private walletRepository: WalletRepository,
  ) {}

  async enterPendingTrade(idOffer: string) {
    const offer = await this.OfferRepository.findOne(idOffer);
    if (!offer) {
      throw new Error('Homework not found');
    }
    /* homework.pendingExchange = true; */
    const newTrade = this.tradeRepository.create({
      offer,
      finalAmount: offer.priceOffer,
      status: TradeStatusEnum.PENDINGTOTRADE,
    });
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
}
