import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_PAIR, DEFAULT_PREC } from '../configs/constants';

import { IBook, IBookRow, IStore } from '../types';

const initialBookState: IBook = {
  bids: [],
  asks: [],
  isConnected: true,
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
    updateAsks: (state, action: PayloadAction<IBookRow[]>) => {
      state.asks = action.payload;
    },
    updateBids: (state, action: PayloadAction<IBookRow[]>) => {
      state.bids = action.payload;
    },
    updatePair: (state, action: PayloadAction<string>) => {
      state.pair = action.payload;
    },
  },
});

export const {
  updatePrec,
  updateAsks,
  updateBids,
  updatePair,
  updateIsConnect,
} = bookSlice.actions;

export const selectBookSlice = (state: IStore) => state.book;

export default bookSlice.reducer;
