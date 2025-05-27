import React from 'react';

type HealthBarProps = {
  hp: number;
  maxHp: number;
};


const HealthBar: React.FC<HealthBarProps> = ({ 
    hp, 
    maxHp
}) => {
  const hpRatio = maxHp > 0 ?  hp /  maxHp : 0;
  const isLow = hpRatio <= 0.25 &&  hp > 0;
  const isOver = hp > maxHp;

  return (
    <div className="w-full h-3 bg-zinc-700 rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-300 ${
          isOver ? 'bg-blue-500' : isLow ? 'bg-red-600 animate-pulse' : 'bg-green-500'
        }`}
        style={{ width: `${Math.min((hp / maxHp) * 100, 100)}%` }}
      ></div>
    </div>
  );
};

export default HealthBar;