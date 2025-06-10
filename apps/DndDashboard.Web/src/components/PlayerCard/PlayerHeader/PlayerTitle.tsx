import React from 'react';
import useSessionActions from "../../../state/session/useSessionActions.ts";

type PlayerTitle = {
  playerId: number;
  playerName: string;
  isDead: boolean;
};

const PlayerTitle: React.FC<PlayerTitle> = ({playerId, playerName, isDead}) => {
  const {updatePlayerField} = useSessionActions();
  return (
       <div className="flex items-center gap-2">
        {isDead && <span>💀</span>}
        <input
            type="text"
            value={playerName}
            onChange={(e) => updatePlayerField(playerId, 'name', (e.target.value))}
            className="text-xl font-semibold p-1 rounded w-full"
        />
        </div>
  );
};
export default PlayerTitle;