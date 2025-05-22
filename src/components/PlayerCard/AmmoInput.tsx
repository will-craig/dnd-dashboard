// AmmoInput.tsx
import React from 'react';

type AmmoInputProps = {
  ammo: number;
  onChange: (value: number) => void;
};

const AmmoInput: React.FC<AmmoInputProps> = ({ ammo, onChange }) => {
  return (
    <div className="mt-2">
      <label className="mr-2">🏹 Ammo:</label>
      <input
        type="number"
        value={ammo}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-zinc-700 p-1 rounded w-20 text-center"
      />
    </div>
  );
};

export default AmmoInput;
