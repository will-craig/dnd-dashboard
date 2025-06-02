import React from 'react';
import sessionActions from "../../state/session/session.actions.ts";

type CurrencyProps = {
  playerId: number;  
  gold: number;
};

const Currency: React.FC<CurrencyProps> = ({playerId, gold }) => {
 const {updatePlayerField} = sessionActions();
    
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
