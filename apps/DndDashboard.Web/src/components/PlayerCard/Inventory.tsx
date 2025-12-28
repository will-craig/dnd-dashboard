import React, { useState } from 'react';
import useSessionActions from "../../state/session/useSessionActions.ts";

export type Item = {
  name: string;
  magic?: boolean;
  quantity?: number;
  type?: 'item' | 'item-qty' | 'ammo' | 'key';
};

export type InventoryType = 'item' | 'item-qty' | 'magic' | 'key' | 'ammo';

type InventoryManagerProps = {
  playerId: string;
  items: Item[]
};

const InventoryManager: React.FC<InventoryManagerProps> = ({playerId, items}) => {
  const {addItemToPlayer, removeItemFromPlayer, updateItemForPlayer} = useSessionActions();
  const displayItems = items.filter((item) => item.type === 'item' || item.type === 'item-qty') ?? [];
  const displayKeys = items.filter((item) => item.type === 'key') ?? [];
  const displayAmmo = items.filter((item) => item.type === 'ammo') ?? [];
  const magicItemCount = items.filter((item) => item.magic).length;

  //catch items being set to 0 before sending up the chain
  const handleItemUpdate = (index: number, updatedItem: Item) => {
    if (updatedItem.quantity !== undefined && updatedItem.quantity <= 0) {
      removeItemFromPlayer(playerId, index);
    } else {
      updateItemForPlayer(playerId, index, updatedItem);
    }
  };

  return (
    
    <div className="mt-4 space-y-2">
      {displayAmmo.length > 0 && 
      <div>
        <p className="mb-1">🏹 Ammo:</p>
        <AmmoList
          ammunition={displayAmmo}
          allItems={items}
          onRemove={(x) => {removeItemFromPlayer(playerId, x)}}
          onUpdate={(x, item) => updateItemForPlayer(playerId, x, item)}/>
      </div>}
      {magicItemCount > 0 && (<p className="text-sm text-indigo-400">✨ Magic Items: {magicItemCount}</p>)}
      {displayItems.length > 0 && 
      <div>
        <p className="mb-1">🎒 Items:</p>
        <ItemList 
            items={displayItems} 
            allItems={items} 
            onRemove={(x) => {removeItemFromPlayer(playerId, x)}} 
            onUpdate={handleItemUpdate}/>
      </div>}
      {displayKeys.length > 0 && <div>
        <p className="mt-2">🔑 Keys:</p>
        <KeyList 
            items={displayKeys} 
            onRemove={(x) => {removeItemFromPlayer(playerId, x)}} 
            allItems={items} />
      </div>}

      <InventoryAddForm onAddItem={(x) => addItemToPlayer(playerId, x)} />
    </div>
  );
};

// --- Internal Components ---
const InventoryAddForm: React.FC<{onAddItem: (item: Item) => void;}> = ({ onAddItem }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<InventoryType>('item');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (!name.trim()) return;
    const newItem: Item = {
      name: name.trim(),
      type: type === 'magic' ? 'item' : type,
      magic: type === 'magic',
      ...(type === 'ammo' || type === 'item-qty' ? { quantity } : {}),
    };
    onAddItem(newItem);
    setName('');
    setType('item');
    setQuantity(1);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center mb-2 min-w-0">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add new..."
        aria-label="Item name"
        className="bg-zinc-700 p-1 rounded w-full min-w-0 text-xs sm:w-32"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as InventoryType)}
        aria-label="Item type"
        className="bg-zinc-700 p-1 rounded text-xs w-full min-w-0 sm:w-auto"
      >
        <option value="item">Item</option>
        <option value="item-qty">Item (with quantity)</option>
        <option value="magic">Magic Item</option>
        <option value="ammo">Ammo</option>
        <option value="key">Key</option>
      </select>
      {(type === 'ammo' || type === 'item-qty') && (
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Quantity"
          aria-label="Item quantity"
          className="bg-zinc-700 p-1 rounded w-20 text-xs min-w-0"
        />
      )}
      <button
        onClick={handleAdd}
        aria-label="Add item"
        className="text-xs bg-green-600 px-2 py-1 rounded"
      >
        Add
      </button>
    </div>
  );
};


const ItemList: React.FC<{
  items: Item[];
  allItems: Item[];
  onRemove: (index: number) => void;
  onUpdate: (index: number, updatedItem: Item) => void;
}> = ({ items, allItems, onRemove, onUpdate}) => {
  if (items.length === 0) return <p className="ml-4 text-zinc-500">No items.</p>;

  return (
    <ul className="ml-4 list-disc">
      {items.map((item) => {
        const idx = allItems.indexOf(item);
        return (
          <li
            key={idx}
            className={`flex flex-wrap gap-2 justify-between items-center min-w-0 ${
              item.magic ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <span className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="break-words">{item.name}</span>
              {(item.quantity && item.quantity > 0) && (
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    {onUpdate(idx, { ...item, quantity: Number(e.target.value) })}
                  }
                  aria-label={`Quantity for ${item.name}`}
                  className="bg-zinc-700 rounded px-1 text-xs w-14 min-w-0"
                />
              )}
            </span>
            <button
              onClick={() => onRemove(idx)}
              aria-label={`Remove ${item.name}`}
              className="text-xs text-red-400 ml-2"
            >
              ✖
            </button>
          </li>
        );
      })}
    </ul>
  );
};

const AmmoList: React.FC<{
  ammunition: Item[];
  allItems: Item[];
  onRemove: (index: number) => void;
  onUpdate: (index: number, updatedItem: Item) => void;
}> = ({ ammunition, allItems, onRemove, onUpdate }) => {

  if (ammunition.length === 0) return <p className="ml-4 text-zinc-500">No Ammo.</p>;

  return (
    <ul className="ml-4 list-disc">
      {ammunition.map((ammoItem) => {
        const idx = allItems.indexOf(ammoItem);
        return (
          <li
            key={idx}
            className="flex flex-wrap gap-2 justify-between items-center min-w-0"
          >
             <span className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="break-words">{ammoItem.name}</span>
              {typeof ammoItem.quantity === 'number' && (
                <input
                  type="number"
                  value={ammoItem.quantity}
                  onChange={(e) =>
                    onUpdate(idx, { ...ammoItem, quantity: Number(e.target.value) })
                  }
                  aria-label={`Quantity for ${ammoItem.name}`}
                  className="bg-zinc-700 rounded px-1 text-xs w-14 min-w-0"
                />
              )}
            </span>
            <button
              onClick={() => onRemove(idx)}
              aria-label={`Remove ${ammoItem.name}`}
              className="text-xs text-red-400 ml-2"
            >
              ✖
            </button>
          </li>
        );
      })}
    </ul>
  );
};

const KeyList: React.FC<{
  items: Item[];
  allItems: Item[];
  onRemove: (index: number) => void;
}> = ({ items, allItems, onRemove }) => {
  if (items.length === 0) return <p className="ml-4 text-zinc-500">No keys.</p>;

  return (
    <ul className="ml-4 list-disc">
      {items.map((item) => {
        const idx = allItems.indexOf(item);
        return (
          <li key={idx} className="flex flex-wrap gap-2 justify-between items-center min-w-0">
            <span className="break-words">{item.name}</span>
            <button
              onClick={() => onRemove(idx)}
              aria-label={`Remove ${item.name}`}
              className="text-xs text-red-400 ml-2"
            >
              ✖
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default InventoryManager;
