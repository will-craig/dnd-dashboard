import { useState } from 'react';

export default function App() {
  type Item = {
    name: string;
    magic?: boolean;
  };

  type Player = {
    id: number;
    name: string;
    hp: number;
    maxHp: number;
    status: string[];
    items: Item[];
    keys: string[];
    ammo: number;
  };

  const allConditions = [
    'Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened', 'Grappled',
    'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned',
    'Prone', 'Restrained', 'Stunned', 'Unconscious'
  ];

  const conditionIcons: Record<string, string> = {
    Blinded: '🙈', Charmed: '💘', Deafened: '🔇', Exhaustion: '😴',
    Frightened: '😱', Grappled: '🤼', Incapacitated: '💤', Invisible: '👻',
    Paralyzed: '🪦', Petrified: '🗿', Poisoned: '☠️', Prone: '🛌',
    Restrained: '🪢', Stunned: '💫', Unconscious: '🧠'
  };


  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: 'Aragorn',
      hp: 38,
      maxHp: 50,
      status: ['Poisoned'],
      items: [
        { name: 'Healing Potion' },
        { name: 'Andúril', magic: true },
      ],
      keys: ['Key of Gondor'],
      ammo: 0
    },
    {
      id: 2,
      name: 'Legolas',
      hp: 42,
      maxHp: 60,
      status: [],
      items: [
        { name: 'Elven Cloak' },
        { name: 'Bow of the Galadhrim', magic: true },
      ],
      keys: ['Forest Gate Key'],
      ammo: 20
    },
    {
      id: 3,
      name: 'Gimli',
      hp: 31,
      maxHp: 45,
      status: ['Stunned', 'Slowed'],
      items: [
        { name: 'Battle Axe' },
        { name: 'Belt of Dwarvenkind', magic: true },
      ],
      keys: ['Mine Key', 'Prison Cell Key'],
      ammo: 0
    },
  ]);

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerHP, setNewPlayerHP] = useState(40);
  const [statusPickerVisible, setStatusPickerVisible] = useState<number | null>(null);
  const [itemInputs, setItemInputs] = useState<Record<number, { name: string; type: string }>>({});

  const addEntry = (playerId: number) => {
    const { name, type } = itemInputs[playerId] || {};
    if (!name) return;

    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== playerId) return p;
        if (type === 'key') {
          return { ...p, keys: [...p.keys, name] };
        } else {
          return { ...p, items: [...p.items, { name, magic: type === 'magic' }] };
        }
      })
    );

    setItemInputs({ ...itemInputs, [playerId]: { name: '', type: 'item' } });
  };

  const removeEntry = (playerId: number, type: string, index: number) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== playerId) return p;
        if (type === 'key') {
          const newKeys = [...p.keys];
          newKeys.splice(index, 1);
          return { ...p, keys: newKeys };
        } else {
          const newItems = [...p.items];
          newItems.splice(index, 1);
          return { ...p, items: newItems };
        }
      })
    );
  };


  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer: Player = {
      id: Date.now(),
      name: newPlayerName.trim(),
      hp: newPlayerHP,
      maxHp: newPlayerHP,
      status: [],
      items: [],
      keys: [],
      ammo: 0
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
          const magicItemCount = player.items.filter(i => i.magic).length;

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
              
              <button
                onClick={() => setStatusPickerVisible(statusPickerVisible === player.id ? null : player.id)}
                className="mt-2 text-xs text-blue-400 underline"
              >
                {statusPickerVisible === player.id ? 'Hide conditions' : 'Edit conditions'}
              </button>
              <div className="mt-2 flex flex-wrap gap-2">
                {player.status.map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300"
                  >
                    <span>{conditionIcons[s] || '❓'}</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 text-sm">
               <p className="mb-1">🎒 Items (✨ {magicItemCount} magic):</p>
              <ul className="ml-4 list-disc">
                  {player.items.map((item, idx) => (
    <li
      key={idx}
      className={`flex justify-between items-center ${
        item.magic ? 'text-indigo-400 font-semibold' : ''
      }`}
    >
      <span>{item.name}</span>
      <button
        onClick={() => removeEntry(player.id, 'item', idx)}
        className="text-xs text-red-400 ml-2"
      >
        ✖
      </button>
    </li>
  ))}
</ul>

<p className="mt-2">🔑 Keys:</p>
<ul className="ml-4 list-disc">
  {player.keys.map((key, idx) => (
    <li key={idx} className="flex justify-between items-center">
      <span>{key}</span>
      <button
        onClick={() => removeEntry(player.id, 'key', idx)}
        className="text-xs text-red-400 ml-2"
      >
        ✖
      </button>
    </li>
  ))}
</ul>
                <div className="mt-2">
                  <label className="mr-2">🏹 Ammo:</label>
                  <input
                    type="number"
                    value={player.ammo}
                    onChange={(e) => updatePlayerField(player.id, 'ammo', Number(e.target.value))}
                    className="bg-zinc-700 p-1 rounded w-20 text-center"
                  />
                </div>
              </div>

             

              {statusPickerVisible === player.id && (
                <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                  {allConditions.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => toggleStatus(player.id, condition)}
                      className={`px-2 py-1 rounded-full text-left ${
                        player.status.includes(condition)
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                      }`}
                    >
                      {conditionIcons[condition]} {condition}
                    </button>
                  
                  ))}
                </div>
              )}
          
              <div className="mt-4">
              <div className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="New name"
                  value={itemInputs[player.id]?.name || ''}
                  onChange={(e) => setItemInputs({
                    ...itemInputs,
                    [player.id]: {
                      ...itemInputs[player.id],
                      name: e.target.value
                    }
                  })}
                  className="bg-zinc-700 p-1 rounded w-32 text-xs"
                />
                <select
                  value={itemInputs[player.id]?.type || 'item'}
                  onChange={(e) => setItemInputs({
                    ...itemInputs,
                    [player.id]: {
                      ...itemInputs[player.id],
                      type: e.target.value
                    }
                  })}
                  className="bg-zinc-700 p-1 rounded text-xs"
                >
                  <option value="item">Item</option>
                  <option value="magic">Magic Item</option>
                  <option value="key">Key</option>
                </select>
                <button
                  onClick={() => addEntry(player.id)}
                  className="text-xs bg-green-600 px-2 py-1 rounded"
                >
                  Add
                </button>
              </div>
            </div>

            </div>
            
          );
        })}
      </div>
    </div>
  );
}