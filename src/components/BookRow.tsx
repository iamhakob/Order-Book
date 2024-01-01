import { FC } from 'react';

import { BookMode } from '../types';

interface BookRowProps {
  row: (number | string)[];
  mode: BookMode;
  percentage?: number;
}

const BookRow: FC<BookRowProps> = ({ row, mode, percentage = 0 }) => {
  const isAsk = mode === 'asks';
  const className = isAsk ? 'text-left' : 'text-right';
  const clampedPercentage = percentage > 100 ? 100 : percentage;

  return (
    <tr className="row">
      {isAsk && (
        <td className="ask-fill" style={{ width: `${clampedPercentage}%` }} />
      )}
      {row.map((el, index) => (
        <td key={index} className={className}>
          {el}
        </td>
      ))}
      {!isAsk && (
        <td className="bid-fill" style={{ width: `${clampedPercentage}%` }} />
      )}
    </tr>
  );
};

export default BookRow;
