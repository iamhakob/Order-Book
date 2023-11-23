export interface IBookRow {
  cnt: number;
  price: number;
  amount: number;
}

export interface IBook {
  bids: IBookRow[];
  asks: IBookRow[];
  isConnected: boolean;
  prec: string;
  pair: string;
}

export interface IStore {
  book: IBook;
}

export type BookMode = 'asks' | 'bids';
