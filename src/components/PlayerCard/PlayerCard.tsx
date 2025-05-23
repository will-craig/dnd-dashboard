import type { Item } from './Inventory';
import InventoryManager from './Inventory';
import PlayerHeader from './PlayerHeader/PlayerHeader';
import PlayerTitle from './PlayerHeader/PlayerTitle';
import StatusManager from './StatusManager';
import Currency from './Currency';
import PlayerImage from './PlayerImage';
import type { Player } from '../../models/Player';

type PlayerHandlers = {
  onUpdateHp: (id: number, hp: number) => void;
  onUpdateMaxHp: (id: number, maxHp: number) => void;
  onUpdateName: (id: number, name: string) => void;
  onUpdateGold: (id: number, gold: number) => void;
  onUpdateAc: (id: number, ac: number) => void;
  onUpdateImage: (id: number, image: string) => void;
  onAddItem: (id: number, item: Item) => void;
  onRemoveItem: (id: number, index: number) => void;
  onUpdateItem: (id: number, index: number, item: Item) => void;
  onUpdateConditions: (id: number, conditions: string[]) => void;
};

type PlayerCardProps = {
  player: Player;
  handlers: PlayerHandlers;
};

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  handlers,
}) => {
  const {
    onUpdateHp,
    onUpdateMaxHp,
    onUpdateName,
    onUpdateAc,
    onUpdateGold,
    onUpdateImage,
    onAddItem,
    onRemoveItem,
    onUpdateItem,
    onUpdateConditions,
  } = handlers;

    const isDead = player.hp === 0;
    const hpRatio = player.maxHp > 0 ?  player.hp /  player.maxHp : 0;
    const isLow = hpRatio <= 0.25 &&  player.hp > 0;

    const handleToggleCondition = (condition: string) => {
      const newConditions = player.status.includes(condition)
        ? player.status.filter((c) => c !== condition)
        : [...player.status, condition];

      onUpdateConditions(player.id, newConditions); // ✅ this should be the toggled array
    };

    return (
        <div
            key={player.id}
            className={`bg-zinc-800 p-4 rounded-2xl shadow-lg flex flex-col gap-2 ${
            isLow ? 'animate-pulse border-red-500 border' : ''
            } ${isDead ? 'opacity-50' : ''}`}
        >
            <PlayerImage image={player.image} onChange={(img:string) => onUpdateImage(player.id, img)} />
            <PlayerTitle playerName={player.name} onChange={(val) => onUpdateName(player.id, val)} isDead={isDead}/>
            <PlayerHeader 
                hp={player.hp} 
                maxHp={player.maxHp} 
                ac={player.ac}
                onChangeAc={(val: number) => onUpdateAc(player.id, val)}
                onChangeHp={(val: number) => onUpdateHp(player.id, val)}
                onChangeMaxHp={(val: number) => onUpdateMaxHp(player.id, val)}  
            />
            
            <StatusManager
                conditions={player.status}
                onToggle={handleToggleCondition}
            />
                        
            <InventoryManager
                items={player.items}
                onAddItem={(item) => onAddItem(player.id, item)}
                onRemoveItem={(index) => onRemoveItem(player.id, index)}
                onUpdateItem={(index, updated) => onUpdateItem(player.id, index, updated)}
            />              
            <Currency gold={player.gold} onChange={(val)=>onUpdateGold(player.id, val)}/>
        </div>
  );
};

export default PlayerCard;
