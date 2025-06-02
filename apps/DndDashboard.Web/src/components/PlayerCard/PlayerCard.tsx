import React from "react";
import InventoryManager from './Inventory';
import PlayerHeader from './PlayerHeader/PlayerHeader';
import PlayerTitle from './PlayerHeader/PlayerTitle';
import StatusManager from './StatusManager';
import Currency from './Currency';
import PlayerImage from './PlayerImage';
import type { Player } from '../../models/Player';

type PlayerCardProps = {
    player: Player
};

const PlayerCard: React.FC<PlayerCardProps> = ({player}) => {

    const isDead = player.hp === 0;
    const hpRatio = player.maxHp > 0 ?  player.hp /  player.maxHp : 0;
    const isLow = hpRatio <= 0.25 &&  player.hp > 0;
    
    return (
        <div
            key={player.id}
            className={`bg-zinc-800 p-4 rounded-2xl shadow-lg flex flex-col gap-2 ${
            isLow ? 'animate-pulse border-red-500 border' : ''
            } ${isDead ? 'opacity-50' : ''}`}
        >
            <PlayerImage playerId={player.id} image={player.image}/>
            <PlayerTitle playerId={player.id} playerName={player.name} isDead={isDead}/>
            <PlayerHeader playerId={player.id} hp={player.hp} maxHp={player.maxHp} ac={player.ac}/>
            <StatusManager playerId={player.id} playerConditions={player.status}/>
            <InventoryManager playerId={player.id} items={player.items}/>              
            <Currency playerId={player.id} gold={player.gold}/>
        </div>
  );
};

export default PlayerCard;
