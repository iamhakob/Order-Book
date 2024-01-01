import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import Loading from 'react-loading';

import Actions from './components/Actions';
import Book from './components/Book';

import { updateAsks, updateBids, selectBookSlice } from './redux/bookSlice';
import { OrderBookChannel, OnDataCB } from './services/OrderBookChannel';
import { useSocketConnect } from './hooks/useSocketConnect';
import { SOCKET_URL } from './configs/constants';

import { Order } from './types';

import './index.scss';

const App = () => {
  const dispatch = useDispatch();
  const { bids, asks, prec, pair, scale, isConnected } =
    useSelector(selectBookSlice);
  const ws = useSocketConnect(SOCKET_URL, isConnected);

  const hasData = !isEmpty(bids) || !isEmpty(asks);

  const setBids = useCallback(
    (value: Order) => dispatch(updateBids(value)),
    [dispatch],
  );
  const setAsks = useCallback(
    (value: Order) => dispatch(updateAsks(value)),
    [dispatch],
  );
  const updateBook: OnDataCB = useCallback(
    (book) => {
      setBids(book.bids);
      setAsks(book.asks);
    },
    [setBids, setAsks],
  );

  useEffect(() => {
    if (!ws || ws.readyState !== ws.OPEN) {
      return;
    }

    const orderBookChannel = new OrderBookChannel(ws, { pair, prec });
    orderBookChannel.onData(updateBook);

    updateBook({ bids: {}, asks: {} });
    orderBookChannel.subscribe();

    return () => {
      orderBookChannel.unsubscribe();
    };
  }, [pair, prec, ws, setBids, setAsks]);

  return (
    <div className="app-container">
      <Actions
        isConnected={isConnected}
        scale={scale}
        prec={prec}
        pair={pair}
      />
      <div className="books-container">
        {hasData ? (
          <Book bids={bids} asks={asks} scale={scale} />
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
