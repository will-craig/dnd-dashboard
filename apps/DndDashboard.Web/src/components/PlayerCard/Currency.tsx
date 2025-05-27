import React from 'react';

type CurrencyProps = {
  gold: number;
  onChange: (value: number) => void;
};

const Currency: React.FC<CurrencyProps> = ({ gold, onChange }) => {
  return (
    <div className="mt-2">
      <label className="mr-2">💰</label>
      <input
        type="number"
        value={gold}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-zinc-700 p-1 rounded w-20 text-center"
      />
    </div>
  );
};

export default Currency;
