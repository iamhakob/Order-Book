import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_PAIR, DEFAULT_PREC } from '../configs/constants';

import { IBook, IStore, Order } from '../types';

const initialBookState: IBook = {
  bids: {},
  asks: {},
  isConnected: true,
  scale: 1,
  prec: DEFAULT_PREC,
  pair: DEFAULT_PAIR,
};

const bookSlice = createSlice({
  name: 'book',
  initialState: initialBookState,
  reducers: {
    updateIsConnect: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    updatePrec: (state, action: PayloadAction<string>) => {
      state.prec = action.payload;
    },
    updateScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
    updateAsks: (state, action: PayloadAction<Order>) => {
      state.asks = action.payload;
    },
    updateBids: (state, action: PayloadAction<Order>) => {
      state.bids = action.payload;
    },
    updatePair: (state, action: PayloadAction<string>) => {
      state.pair = action.payload;
    },
  },
});

export const {
  updatePrec,
  updateScale,
  updateAsks,
  updateBids,
  updatePair,
  updateIsConnect,
} = bookSlice.actions;

export const selectBookSlice = (state: IStore) => state.book;

export default bookSlice.reducer;
