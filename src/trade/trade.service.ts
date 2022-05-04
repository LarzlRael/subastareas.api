import { Injectable } from '@nestjs/common';
import { TradeRepository } from './trade.repository';
import { OfferRepository } from '../offer/offer.repository';
import { UsersRepository } from '../auth/user.repository';
import { WalletRepository } from '../wallet/wallet.repository';

@Injectable()
export class TradeService {
  constructor(
    private tradeRepository: TradeRepository,
    private OfferRepository: OfferRepository,
    private userRepository: UsersRepository,
    private walletRepository: WalletRepository,
  ) {}
  async newTrade(idOffer: string) {
    const offer = await this.OfferRepository.findOne(idOffer);
    if (!offer) {
      throw new Error('Offer not found');
    }
    /* const trade = await this.tradeRepository.newTrade(
      offer,
      'this is a testing URL',
    ); */
    const offerUserWallet = await this.walletRepository.findOne({
      user: offer.user,
    });
    const homeWoekUserUserWallet = await this.walletRepository.findOne({
      user: offer.homework.user,
    });
    console.log(homeWoekUserUserWallet);
    console.log(offerUserWallet);

    /* offerUser.wallet.balance = offerUser.wallet.balance + offer.priceOffer; */

    /* homeworkUser.wallet.balance =
      homeworkUser.wallet.balance - offer.priceOffer; */

    /* await this.userRepository.save(offerUser);
    await this.userRepository.save(homeworkUser); */
    return null;
  }
}
