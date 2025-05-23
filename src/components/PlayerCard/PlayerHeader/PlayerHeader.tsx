import React from 'react';
import PlayerHealth from './PlayerHealth';
import HealthBar from './HealthBar';
import ArmourClass from './ArmorClass';

type PlayerHeaderProps = {
  hp: number;
  maxHp: number;
  ac: number;
  onChangeHp: (value: number) => void;
  onChangeMaxHp: (value: number) => void;
  onChangeAc: (value: number) => void;
};

const PlayerHeader: React.FC<PlayerHeaderProps> = ({hp, maxHp, ac, onChangeHp, onChangeMaxHp, onChangeAc}) => {
  return (     
    <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
            
            <PlayerHealth 
                hp={hp} 
                maxHp={maxHp} 
                onChangeHp={(val: number) => onChangeHp(val)}
                onChangeMaxHp={(val: number) => onChangeMaxHp(val)}  
                />
                
            <ArmourClass ac={ac} onChange={(val) => onChangeAc(val)}/>

        </div>        
        <HealthBar hp={hp} maxHp={maxHp}/>
    </div>
 
  );
};

export default PlayerHeader;