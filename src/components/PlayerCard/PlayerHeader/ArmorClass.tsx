import React from 'react';

type ArmourClassProps = {
  ac: number;
  onChange: (value: number) => void;
};

const ArmourClass: React.FC<ArmourClassProps> = ({ ac, onChange }) => {
  return (
      <div className="flex items-center gap-1 text-sm ml-4">
        <span className="text-zinc-400">🛡 AC:</span>
        <input
          type="number"
          value={ac}
          onChange={(e) => onChange(Number(e.target.value))}
          className="bg-zinc-700 rounded px-2 w-14 text-center"
        />
      </div>
  );
};

export default ArmourClass;
