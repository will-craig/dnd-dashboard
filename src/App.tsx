import { useState } from 'react';
import StatusManager from './components/PlayerCard/StatusManager';
import InventoryManager, { type Item } from './components/PlayerCard/Inventory';
import Currency from './components/PlayerCard/Currency';

export default function App() {
  
type Player = {
  id: number;
  name: string;
  hp: number;
  ac: number;
  gold: number;
  maxHp: number;
  status: string[];
  items: {
    name: string;
    magic?: boolean;
    quantity?: number;
    type?: 'item' | 'item-qty' | 'ammo' | 'key';
  }[];
  // other fields...
}
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: 'Aragorn',
      hp: 50,
      ac: 15,
      gold: 100,
      maxHp: 40,
      status: ['Poisoned'],
      items: [
        { name: 'Healing Potion', type: 'item-qty', quantity: 2 },
        { name: 'Andúril', magic: true, type: 'item' },
        { name: 'Key of Gondor', type: 'key' },
      ],
    },
    {
      id: 2,
      name: 'Legolas',
      ac: 14,
      gold: 50,
      hp: 40,
      maxHp: 40,
      status: [],
      items: [
        { name: 'Elven Cloak', type: 'item' },
        { name: 'Bow of the Galadhrim', magic: true, type: 'item' },
        { name: 'Quiver of Arrows', quantity: 20, type: 'ammo' },
      ],
    },
    {
      id: 3,
      name: 'Gimli',
      hp: 31,
      ac: 16,
      gold: 20,
      maxHp: 45,
      status: ['Stunned', 'Slowed'],
      items: [
        { name: 'Battle Axe', type: 'item' },
        { name: 'Mine Key', type: 'key' },
        { name: 'Prison Cell Key', type: 'key' },
      ]}
  ]);

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerHP, setNewPlayerHP] = useState(40);
  const [statusPickerVisible, setStatusPickerVisible] = useState<number | null>(null);

  const addItemToPlayer = (playerId: number, item: Item) => {
    setPlayers(prev =>
      prev.map(p =>
        p.id === playerId
          ? { ...p, items: [...p.items, item] }
          : p
      )
    );
  };

  const removeItemFromPlayer = (playerId: number, index: number) => {
    setPlayers(prev =>
      prev.map(p =>
        p.id === playerId
          ? { ...p, items: p.items.filter((_, i) => i !== index) }
          : p
      )
    );
  };

  const updateItemForPlayer = (playerId: number, index: number, updatedItem: Item) => {
  setPlayers(prev =>
    prev.map(p =>
      p.id === playerId
        ? {
            ...p,
            items: p.items.map((item, i) => (i === index ? updatedItem : item))
          }
        : p
      )
    );
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer: Player = {
      id: Date.now(),
      name: newPlayerName.trim(),
      hp: newPlayerHP,
      ac: 10,
      gold: 0,
      maxHp: newPlayerHP,
      status: [],
      items: []
    };
    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    setNewPlayerHP(40);
  };

  const updateHP = (id: number, newHP: number) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, hp: Math.max(0, newHP) } : p
      )
    );
  };

  const updateMaxHP = (id: number, newMaxHP: number) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, maxHp: newMaxHP } : p
      )
    );
  };

  const toggleStatus = (id: number, condition: string) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const hasCondition = p.status.includes(condition);
        return {
          ...p,
          status: hasCondition
            ? p.status.filter((s) => s !== condition)
            : [...p.status, condition],
        };
      })
    );
  };

  const updatePlayerField = (id: number, field: keyof Player, value: any) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const updateGold = (id: number, newGold: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, gold: newGold } : p))
    );
  };

  

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🧙 D&D Dashboard</h1>

      <div className="mb-6 flex gap-4 items-end">
        <input
          type="text"
          placeholder="Player name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          className="bg-zinc-800 p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="number"
          placeholder="HP"
          value={newPlayerHP}
          onChange={(e) => setNewPlayerHP(Number(e.target.value))}
          className="bg-zinc-800 p-2 rounded w-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={addPlayer}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          Add Player
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {players.map((player) => {
          const hpRatio = player.maxHp > 0 ? player.hp / player.maxHp : 0;
          const isLow = hpRatio <= 0.25 && player.hp > 0;
          const isOver = player.hp > player.maxHp;
          const isDead = player.hp === 0;

          return (
            <div
              key={player.id}
              className={`bg-zinc-800 p-4 rounded-2xl shadow-lg flex flex-col gap-2 ${
                isLow ? 'animate-pulse border-red-500 border' : ''
              } ${isDead ? 'opacity-50' : ''}`}
            >
             
              <div className="flex items-center gap-2">
                {isDead && <span>💀</span>}
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayerField(player.id, 'name', e.target.value)}
                  className="text-xl font-semibold p-1 rounded w-full"
                />
              </div>
              <div className="flex gap-2 items-center">
              
                <label className="text-sm text-zinc-300">HP:</label>
                <input
                  type="number"
                  value={player.hp}
                  min={0}
                  onChange={(e) => updateHP(player.id, Number(e.target.value))}
                  className="bg-zinc-700 p-1 rounded w-20 text-center"
                />
                <span className="text-sm text-zinc-400">/</span>
                <input
                  type="number"
                  value={player.maxHp}
                  min={1}
                  onChange={(e) => updateMaxHP(player.id, Number(e.target.value))}
                  className="bg-zinc-700 p-1 rounded w-20 text-center"
                />
              </div>
              

              <div className="w-full h-3 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOver ? 'bg-blue-500' : isLow ? 'bg-red-600 animate-pulse' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((player.hp / player.maxHp) * 100, 100)}%` }}
                ></div>
              </div>

              <StatusManager
                conditions={player.status}
                onToggle={(condition) => toggleStatus(player.id, condition)}
                showPicker={statusPickerVisible === player.id}
                onTogglePicker={() =>
                  setStatusPickerVisible(statusPickerVisible === player.id ? null : player.id)}
              />
                            
              <InventoryManager
                items={player.items}
                onAddItem={(item) => addItemToPlayer(player.id, item)}
                onRemoveItem={(index) => removeItemFromPlayer(player.id, index)}
                onUpdateItem={(index, updated) => updateItemForPlayer(player.id, index, updated)}
              />              

                <Currency gold={player.gold} onChange={(g)=>updateGold(player.id,g)}/>
            </div>
            
          );
        })}
      </div>
    </div>
  );
}