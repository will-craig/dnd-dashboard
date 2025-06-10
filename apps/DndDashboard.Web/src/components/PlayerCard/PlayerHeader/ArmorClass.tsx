import React from 'react';
import useSessionActions from "../../../state/session/useSessionActions.ts";

type ArmourClassProps = {
  playerId: number;
  ac: number;
};

const ArmourClass: React.FC<ArmourClassProps> = ({ playerId, ac }) => {
    
  const {updatePlayerField} = useSessionActions();
  
  return (
      <div className="flex items-center gap-1 text-sm ml-4">
        <span className="text-zinc-400">🛡 AC:</span>
        <input
          type="number"
          value={ac}
          onChange={(e) => updatePlayerField(playerId, 'ac', Number(e.target.value))}
          className="bg-zinc-700 rounded px-2 w-14 text-center"
        />
      </div>
  );
};

export default ArmourClass;
