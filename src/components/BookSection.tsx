import { FC } from 'react';

import BookRow from './BookRow';
import { ASKS_HEADER_COLUMNS, BIDS_HEADER_COLUMNS } from '../configs/constants';

import { BookMode, IBookTotalRow } from '../types';

interface BookSectionProps {
  data: IBookTotalRow[];
  scale: number;
  mode: BookMode;
  maxTotal: number;
}

const BookSection: FC<BookSectionProps> = ({ data, scale, maxTotal, mode }) => {
  const isAsksMode = mode === 'asks';
  const headerColumns = isAsksMode ? ASKS_HEADER_COLUMNS : BIDS_HEADER_COLUMNS;

  return (
    <div>
      <table className="book-table">
        <thead>
          <BookRow row={headerColumns} mode={mode} />
        </thead>

        <tbody>
          {data.map(({ price, cnt, amount, total }, index) => {
            const rowData = isAsksMode
              ? [price, total, cnt, amount.toFixed(4)]
              : [amount.toFixed(4), cnt, total, price];

            return (
              <BookRow
                row={rowData}
                key={index}
                mode={mode}
                percentage={(total / maxTotal) * scale * 100}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookSection;
