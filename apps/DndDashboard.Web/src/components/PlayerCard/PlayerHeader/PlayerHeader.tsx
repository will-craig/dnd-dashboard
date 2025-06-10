import React from 'react';
import PlayerHealth from './PlayerHealth';
import HealthBar from './HealthBar';
import ArmourClass from './ArmorClass';
import useSessionActions from "../../../state/session/useSessionActions.ts";

type PlayerHeaderProps = {
  playerId: number;
  hp: number;
  maxHp: number;
  ac: number;
};

const PlayerHeader: React.FC<PlayerHeaderProps> = ({playerId, hp, maxHp, ac}) => {
  const {updatePlayerField} = useSessionActions();
  return (     
    <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
            
            <PlayerHealth 
                hp={hp} 
                maxHp={maxHp} 
                onChangeHp={(val: number) => updatePlayerField(playerId, 'hp', val)}
                onChangeMaxHp={(val: number) => updatePlayerField(playerId, 'maxHp', val)}
                />
                
            <ArmourClass playerId={playerId} ac={ac}/>

        </div>        
        <HealthBar hp={hp} maxHp={maxHp}/>
    </div>
 
  );
};

export default PlayerHeader;