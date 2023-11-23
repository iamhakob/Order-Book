import { FC, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';

import { updatePrec, updatePair, updateIsConnect } from '../redux/bookSlice';
import { PAIRS, PRECISION_OPTIONS } from '../configs/constants';
import Select from './Select';
import Toggle from './Toggle';

interface ActionsProps {
  prec: string;
  pair: string;
  isConnected: boolean;
}

const Actions: FC<ActionsProps> = ({ prec, pair, isConnected }) => {
  const dispatch = useDispatch();

  const setPrec = useCallback(
    (value: string) => dispatch(updatePrec(value)),
    [dispatch],
  );
  const setPair = useCallback(
    (value: string) => dispatch(updatePair(value)),
    [dispatch],
  );
  const toggleConnect = useCallback(
    () => dispatch(updateIsConnect(!isConnected)),
    [dispatch, isConnected],
  );

  return (
    <div className="actions-container">
      <Select
        label="Choose Precision:"
        options={PRECISION_OPTIONS}
        onChange={setPrec}
        value={prec}
      />
      <Select
        label="Choose Pair:"
        options={PAIRS}
        onChange={setPair}
        value={pair}
      />
      <Toggle
        isOn={isConnected}
        onLabel="Connected"
        offLabel="Disconnected"
        onToggle={toggleConnect}
      />
    </div>
  );
};

export default memo(Actions);
