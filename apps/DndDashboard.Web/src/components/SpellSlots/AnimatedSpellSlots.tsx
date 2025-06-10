import React from 'react';

interface AnimatedSpellSlotsProps {
    level: number;
    used: number;
    max: number;
}

export const AnimatedSpellSlots: React.FC<AnimatedSpellSlotsProps> = ({ level, used, max }) => {
    return (
        <div className="flex gap-1 items-center">
            {Array.from({ length: max }).map((_, i) => {
                const isUsed = i < used;
                const intensityFactor = 1 + level * 0.05; // increase scale by level
                return (
                    <span
                        key={i}
                        className={`text-2xl ${isUsed ? 'text-red-500' : 'text-yellow-300'} animate-pulse`}
                        style={{ transform: `scale(${intensityFactor})` }}
                    >
            🔥
          </span>
                );
            })}
        </div>
    );
};

export default AnimatedSpellSlots;
