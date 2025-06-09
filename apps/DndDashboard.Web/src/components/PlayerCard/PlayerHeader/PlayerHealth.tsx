import React from 'react';

type PlayerHealthProps = {
  hp: number;
  maxHp: number;
  onChangeHp: (value: number) => void;
  onChangeMaxHp: (value: number) => void;
};

const PlayerHealth: React.FC<PlayerHealthProps> = ({hp, maxHp, onChangeHp, onChangeMaxHp}) => {
  return (
    <div className={`flex gap-2 items-center`}>
      <label className="text-sm text-zinc-300">HP:</label>
      <input
          type="number"
          value={hp}
          min={0}
          onChange={(e) => onChangeHp(Number(e.target.value))}
          className="bg-zinc-700 p-1 rounded w-20 text-center" />
      <span className="text-sm text-zinc-400">/</span>
      <input
          type="number"
          value={maxHp}
          min={1}
          onChange={(e) => onChangeMaxHp(Number(e.target.value))}
          className="bg-zinc-700 p-1 rounded w-20 text-center" />    
    </div>
    
  );
};

export default PlayerHealth;