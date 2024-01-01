import { FC, useCallback } from 'react';

import BookSection from './BookSection';
import forEach from '../utils/forEach';

import { IBookTotalRow, Order } from '../types';

interface BookSectionProps {
  bids: Order;
  asks: Order;
  scale: number;
}

const Book: FC<BookSectionProps> = ({ bids, asks, scale }) => {
  const calculateWithTotal = useCallback((data: Order, isAsksMode = false) => {
    const keys = Object.keys(data);
    // modifiedData serves as a prefix sum array
    const modifiedData: IBookTotalRow[] = [];
    forEach(
      keys,
      (key, i) => {
        const row = data[key];
        const total = row.amount + (modifiedData[i - 1]?.total || 0);
        modifiedData.push({ ...row, total: +total.toFixed(4) });
      },
      // !isAsksMode is passed to have the correct order for bids
      !isAsksMode,
    );
    return modifiedData;
  }, []);

  const bidRows = calculateWithTotal(bids);
  const askRows = calculateWithTotal(asks, true);

  const maxTotal = Math.max(
    bidRows[bidRows.length - 1].total,
    askRows[askRows.length - 1].total,
  );

  return (
    <>
      <BookSection
        maxTotal={maxTotal}
        data={bidRows}
        scale={scale}
        mode="bids"
      />
      <BookSection
        maxTotal={maxTotal}
        data={askRows}
        scale={scale}
        mode="asks"
      />
    </>
  );
};

export default Book;
