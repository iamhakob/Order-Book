import { FC, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';

import Select from './Select';
import Toggle from './Toggle';

import {
  updatePrec,
  updatePair,
  updateIsConnect,
  updateScale,
} from '../redux/bookSlice';
import {
  PAIRS,
  PRECISION_OPTIONS,
  MIN_SCALE,
  MAX_SCALE,
  SCALE_MOVE,
} from '../configs/constants';

interface ActionsProps {
  prec: string;
  pair: string;
  scale: number;
  isConnected: boolean;
}

const Actions: FC<ActionsProps> = ({ prec, scale, pair, isConnected }) => {
  const dispatch = useDispatch();

  const scaleUp = useCallback(() => {
    const nextVal = scale + SCALE_MOVE;
    if (nextVal <= MAX_SCALE) dispatch(updateScale(nextVal));
  }, [dispatch, scale]);

  const scaleDown = useCallback(() => {
    const nextVal = scale - SCALE_MOVE;
    if (nextVal >= MIN_SCALE) dispatch(updateScale(nextVal));
  }, [dispatch, scale]);

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
      <div>
        <label>Scale: {scale}</label>
        <button onClick={scaleUp}>+</button>
        <button onClick={scaleDown}>-</button>
      </div>
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
