import { TradeStatusEnum } from '../../enums/enums';
export interface OfferToSendI {
  id: number;
  priceOffer: number;
  edited: boolean;
  status: TradeStatusEnum;
  user: {
    id: number;
    username: string;
    profileImageUrl: string;
  };
}
