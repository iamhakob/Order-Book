import { Option } from '../components/Select';

export const PRECISION_OPTIONS: Option[] = [
  { title: '5', value: 'P0' },
  { title: '4', value: 'P1' },
  { title: '3', value: 'P2' },
  { title: '2', value: 'P3' },
  { title: '1', value: 'P4' },
];

export const ASKS_HEADER_COLUMNS = ['Price', 'Count', 'Amount'];
export const BIDS_HEADER_COLUMNS = ['Amount', 'Count', 'Price'];

// using fixed pairs, though we could get this dynamically from API as well
export const PAIRS = [
  {
    title: 'BTC/USD',
    value: 'tBTCUSD',
  },
  {
    title: 'ETH/USD',
    value: 'tETHUSD',
  },
];

export const DEFAULT_PREC = PRECISION_OPTIONS[0].value;

export const DEFAULT_PAIR = PAIRS[0].value;
