import React from 'react';

type PlayerTitle = {
  playerName: string;
  onChange: (value: string) => void;
  isDead: boolean;
};

const PlayerTitle: React.FC<PlayerTitle> = ({playerName, onChange, isDead}) => {
  return (
       <div className="flex items-center gap-2">
        {isDead && <span>💀</span>}
        <input
            type="text"
            value={playerName}
            onChange={(e) => onChange(e.target.value)}
            className="text-xl font-semibold p-1 rounded w-full"
        />
        </div>
  );
};
export default PlayerTitle;