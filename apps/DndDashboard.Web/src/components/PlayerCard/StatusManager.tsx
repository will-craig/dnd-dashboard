import React, { useState } from 'react';

const conditionIcons: Record<string, string> = {
  Blinded: '🙈',
  Charmed: '💘',
  Deafened: '🦻',
  Frightened: '😱',
  Grappled: '🤼',
  Incapacitated: '💤',
  Invisible: '👻',
  Paralyzed: '♿',
  Petrified: '🗿',
  Poisoned: '☠️',
  Prone: '🛌',
  Restrained: '🪢',
  Stunned: '💫',
  Unconscious: '😴'
};

const allConditions = Object.keys(conditionIcons);

type StatusManagerProps = {
  conditions: string[];
  onToggle: (condition: string) => void;
};

const StatusManager: React.FC<StatusManagerProps> = ({
  conditions,
  onToggle
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2">
        {conditions.map((condition) => (
          <div
            key={condition}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300"
          >
            <span>{conditionIcons[condition]}</span>
            <span>{condition}</span>
          </div>
        ))}
      </div>

      {showPicker && (
        <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
          {allConditions.map((condition) => (
            <button
              key={condition}
              onClick={() => onToggle(condition)}
              className={`px-2 py-1 rounded-full text-left ${
                conditions.includes(condition)
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              {conditionIcons[condition]} {condition}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowPicker(!showPicker)}
        className="mt-2 text-xs text-blue-400 underline"
      >
        {showPicker ? 'Hide conditions' : 'Edit conditions'}
      </button>
    </div>
  );
};

export default StatusManager;
