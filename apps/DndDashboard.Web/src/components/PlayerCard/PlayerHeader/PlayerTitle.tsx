import React from 'react';
import useSessionActions from "../../../state/session/useSessionActions.ts";

type PlayerTitle = {
  playerId: string;
  playerName: string;
  isDead: boolean;
};

const PlayerTitle: React.FC<PlayerTitle> = ({playerId, playerName, isDead}) => {
  const {updatePlayerField} = useSessionActions();
  return (
       <div className="flex items-center gap-2 min-w-0">
        {isDead && <span className="text-xs uppercase text-red-400">💀</span>}
        <input
            type="text"
            value={playerName}
            onChange={(e) => updatePlayerField(playerId, 'name', (e.target.value))}
            aria-label="Player name"
            className="text-xl font-semibold p-1 rounded w-full min-w-0"
        />
        </div>
  );
};
export default PlayerTitle;
