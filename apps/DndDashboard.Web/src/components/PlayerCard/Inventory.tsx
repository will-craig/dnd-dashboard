import React, { useState } from 'react';

export type Item = {
  name: string;
  magic?: boolean;
  quantity?: number;
  type?: 'item' | 'item-qty' | 'ammo' | 'key';
};

export type InventoryType = 'item' | 'item-qty' | 'magic' | 'key' | 'ammo';

type InventoryManagerProps = {
  items: Item[];
  onAddItem: (item: Item) => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, updatedItem: Item) => void;
};

const InventoryManager: React.FC<InventoryManagerProps> = ({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}) => {
  const displayItems = items.filter((item) => item.type === 'item' || item.type === 'item-qty') ?? [];
  const displayKeys = items.filter((item) => item.type === 'key') ?? [];
  const displayAmmo = items.filter((item) => item.type === 'ammo') ?? [];
  const magicItemCount = items.filter((item) => item.magic).length;

  //catch items being set to 0 before sending up the chain
  const handleItemUpdate = (index: number, updatedItem: Item) => {
    if (updatedItem.quantity !== undefined && updatedItem.quantity <= 0) {
        onRemoveItem(index);
    } else {
        onUpdateItem(index, updatedItem);
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
          onRemove={onRemoveItem}
          onUpdate={onUpdateItem}/>
      </div>}
      {magicItemCount > 0 && (<p className="text-sm text-indigo-400">✨ Magic Items: {magicItemCount}</p>)}
      {displayItems.length > 0 && 
      <div>
        <p className="mb-1">🎒 Items:</p>
        <ItemList 
            items={displayItems} 
            allItems={items} 
            onRemove={onRemoveItem} 
            onUpdate={handleItemUpdate}/>
      </div>}
      {displayKeys.length > 0 && <div>
        <p className="mt-2">🔑 Keys:</p>
        <KeyList 
            items={displayKeys} 
            onRemove={onRemoveItem} 
            allItems={items} />
      </div>}

      <InventoryAddForm onAddItem={onAddItem} />
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
    <div className="flex gap-2 items-center mb-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add new..."
        className="bg-zinc-700 p-1 rounded w-32 text-xs"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as InventoryType)}
        className="bg-zinc-700 p-1 rounded text-xs"
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
          className="bg-zinc-700 p-1 rounded w-20 text-xs"
        />
      )}
      <button
        onClick={handleAdd}
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
            className={`flex justify-between items-center ${
              item.magic ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <span className="flex items-center gap-2">
              {item.name}
              {(item.quantity && item.quantity > 0) && (
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    {onUpdate(idx, { ...item, quantity: Number(e.target.value) })}
                  }
                  className="bg-zinc-700 rounded px-1 text-xs w-14"
                />
              )}
            </span>
            <button
              onClick={() => onRemove(idx)}
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
            className={`flex justify-between items-center`}
          >
             <span className="flex items-center gap-2">
              {ammoItem.name}
              {typeof ammoItem.quantity === 'number' && (
                <input
                  type="number"
                  value={ammoItem.quantity}
                  onChange={(e) =>
                    onUpdate(idx, { ...ammoItem, quantity: Number(e.target.value) })
                  }
                  className="bg-zinc-700 rounded px-1 text-xs w-14"
                />
              )}
            </span>
            <button
              onClick={() => onRemove(idx)}
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
          <li key={idx} className="flex justify-between items-center">
            <span>{item.name}</span>
            <button
              onClick={() => onRemove(idx)}
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