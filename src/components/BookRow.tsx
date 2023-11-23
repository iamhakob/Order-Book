import { FC } from 'react';
import { BookMode } from '../types';

interface BookRowProps {
  row: (number | string)[];
  mode: BookMode;
}

const BookRow: FC<BookRowProps> = ({ row, mode }) => {
  const className = mode === 'asks' ? 'text-left' : 'text-right';

  return (
    <tr>
      {row.map((el, index) => (
        <td key={index} className={className}>
          {el}
        </td>
      ))}
    </tr>
  );
};

export default BookRow;
