export interface IBookRow {
  cnt: number;
  price: number;
  amount: number;
}

export type IBookTotalRow = IBookRow & { total: number };

export type Order = { [key: string]: IBookRow };

export interface IBook {
  bids: Order;
  asks: Order;
  isConnected: boolean;
  prec: string;
  scale: number;
  pair: string;
}

export interface IStore {
  book: IBook;
}

export type BookMode = 'asks' | 'bids';
