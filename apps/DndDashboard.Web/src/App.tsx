import { useState } from 'react';
import PlayerCard from './components/PlayerCard/PlayerCard';
import type { Player } from './models/Player';
import type { Item } from './models/Item';

export default function App() {
  
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

  const updatePlayerField = <key extends keyof Player>(
    id: number,
    field: key,
    value: Player[key]
  ) => {
    setPlayers(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl2:grid-cols-6 gap-6">
        {players.map((p) => (
          <PlayerCard
            key={p.id}
            player={p}
            handlers={{
              onUpdateHp: (id, hp) => updatePlayerField(id, 'hp', hp),
              onUpdateMaxHp: (id, maxHp) => updatePlayerField(id, 'maxHp', maxHp),
              onUpdateName: (id, name) => updatePlayerField(id, 'name', name),
              onUpdateGold: (id, gold) => updatePlayerField(id, 'gold', gold),
              onUpdateAc: (id, ac) => updatePlayerField(id, 'ac', ac),
              onUpdateImage: (id, image) => updatePlayerField(id, 'image', image),
              onUpdateConditions: (id, conditions) => updatePlayerField(id, 'status', conditions), // ✅ correct usage
              onAddItem: addItemToPlayer,
              onRemoveItem: removeItemFromPlayer,
              onUpdateItem: updateItemForPlayer,
            }}
          />
        ))}
      </div>
    </div>
  );
}