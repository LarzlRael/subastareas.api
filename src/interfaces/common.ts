export interface OfferRoomI {
  room: string;
  offer: object;
}
export interface PriceDollarToday {
  success: boolean;
  timestamp: number;
  base: string;
  date: Date;
  rates: { [key: string]: number };
}
