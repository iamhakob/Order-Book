import { FC } from 'react';
import Switch from 'react-switch';

interface ToggleProps {
  onLabel: string;
  offLabel: string;
  isOn: boolean;
  onToggle: () => void;
}

const Toggle: FC<ToggleProps> = ({ onLabel, offLabel, isOn, onToggle }) => {
  return (
    <div className="switch-container">
      <Switch
        onChange={onToggle}
        checked={isOn}
        width={50}
        height={18}
        uncheckedIcon={false}
        checkedIcon={false}
        onColor="#1974D2"
      />
      <label>{isOn ? onLabel : offLabel}</label>
    </div>
  );
};

export default Toggle;
