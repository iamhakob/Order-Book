import { FC } from 'react';

import BookRow from './BookRow';

import { ASKS_HEADER_COLUMNS, BIDS_HEADER_COLUMNS } from '../configs/constants';

import { IBookRow, BookMode } from '../types';

interface BookSectionProps {
  data: IBookRow[];
  mode: BookMode;
}

const BookSection: FC<BookSectionProps> = ({ data, mode }) => {
  const isAsksMode = mode === 'asks';
  const headerColumns = isAsksMode ? ASKS_HEADER_COLUMNS : BIDS_HEADER_COLUMNS;

  return (
    <div>
      <table className="book-table">
        <thead>
          <BookRow row={headerColumns} mode={mode} />
        </thead>

        <tbody>
          {data.map(({ price, cnt, amount }, index) => {
            const rowData = isAsksMode
              ? [price, cnt, amount]
              : [amount, cnt, price];

            return <BookRow row={rowData} key={index} mode={mode} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookSection;
