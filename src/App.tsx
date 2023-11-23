import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'react-loading';

import { updateAsks, updateBids, selectBookSlice } from './redux/bookSlice';
import { OrderBookChannel, OnDataCB } from './services/OrderBookChannel';

import Actions from './components/Actions';
import BookSection from './components/BookSection';

import { IBookRow } from './types';

import './index.scss';

const App = () => {
  const dispatch = useDispatch();
  const { bids, asks, prec, pair, isConnected } = useSelector(selectBookSlice);

  const hasData = bids.length > 0 || asks.length > 0;

  const setBids = useCallback(
    (value: IBookRow[]) => dispatch(updateBids(value)),
    [dispatch],
  );
  const setAsks = useCallback(
    (value: IBookRow[]) => dispatch(updateAsks(value)),
    [dispatch],
  );

  useEffect(() => {
    const orderBookChannel = new OrderBookChannel();

    const updateBook: OnDataCB = (book) => {
      setBids(book.bids);
      setAsks(book.asks);
    };
    orderBookChannel.onData(updateBook);

    // if disconnected leave the book state as is, and do not start a socket connection
    if (isConnected) {
      updateBook({ bids: [], asks: [] });
      orderBookChannel.init({ pair, prec });
    }

    return () => {
      orderBookChannel.closeChannel();
    };
  }, [pair, prec, isConnected, setBids, setAsks]);

  return (
    <div className="app-container">
      <Actions isConnected={isConnected} prec={prec} pair={pair} />
      <div className="books-container">
        {hasData ? (
          <>
            <BookSection data={bids} mode="bids" />
            <BookSection data={asks} mode="asks" />
          </>
        ) : (
          <div className="loading-container">
            <Loading type="spin" color="#ffffff" />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
