import React from 'react';
import useSessionActions from "../../state/session/useSessionActions.ts";

type CurrencyProps = {
  playerId: number;  
  gold: number;
};

const Currency: React.FC<CurrencyProps> = ({playerId, gold }) => {
 const {updatePlayerField} = useSessionActions();
    
  return (
    <div className="mt-2">
      <label className="mr-2">💰</label>
      <input
        type="number"
        value={gold}
        onChange={(e) => updatePlayerField(playerId, 'gold', Number(e.target.value))}
        className="bg-zinc-700 p-1 rounded w-20 text-center"
      />
    </div>
  );
};

export default Currency;
