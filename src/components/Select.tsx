import { FC } from 'react';

export interface Option {
  title: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const Select: FC<SelectProps> = ({ options, label, value, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <select onChange={(e) => onChange(e.currentTarget.value)} value={value}>
        {options.map(({ title, value }) => (
          <option key={value} value={value}>
            {title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
