// src/components/SpellSlots.tsx
import Lottie from "lottie-react";
import spellAnim from "../../assets/SpellSlot.json";
import spellUsed from "../../assets/SpellSlotUsed.json";
import type { SpellSlot } from "../../models/SpellSlots";
import useSessionActions from "../../state/session/useSessionActions";
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

type SpellSlotsProps = {
    playerId: string;
    slots: SpellSlot[];
};

export default function SpellSlots({ playerId, slots }: SpellSlotsProps) {
    const { updatePlayerField } = useSessionActions();

    // Derive visible levels: only show levels with at least one slot
    const visibleLevels = slots
        .filter(kvp => kvp.slots?.length > 0)
        .map(kvp => kvp.level)
        .sort((a, b) => a - b);

    // Determine highest existing level (for adding new level)
    const existingLevels = slots.map(kvp => kvp.level);
    const highestLevel = existingLevels.length > 0 ? Math.max(...existingLevels) : 1;

    const addLevel = () => {
        if (highestLevel >= 9) return;
        const nextLevel = highestLevel + 1;
        // Initialize with a single unused slot so it appears in visibleLevels
        const newSlots: SpellSlot[] = [...slots, { level: nextLevel, slots: [true] }];
        updatePlayerField(playerId, "spellSlots", newSlots);
    };

    const removeLevel = (level: number) => {
        // Remove the entire level
        const newSlots = slots.filter(kvp => kvp.level !== level);
        updatePlayerField(playerId, "spellSlots", newSlots);
    };

    const addSlot = (level: number) => {
        const newSlots = slots.map(kvp =>
            kvp.level === level
                ? { ...kvp, slots: [...kvp.slots, true] }
                : kvp
        );
        updatePlayerField(playerId, "spellSlots", newSlots);
    };

    const removeSlot = (level: number) => {
        const newSlots = slots.map(kvp =>
            kvp.level === level && kvp.slots.length > 1
                ? { ...kvp, slots: kvp.slots.slice(0, -1) }
                : kvp
        );
        updatePlayerField(playerId, "spellSlots", newSlots);
    };

    const toggleSlot = (level: number, index: number) => {
        const newSlots = slots.map(kvp =>
            kvp.level === level
                ? {
                    ...kvp,
                    slots: kvp.slots.map((used, i) => (i === index ? !used : used)),
                }
                : kvp
        );
        updatePlayerField(playerId, "spellSlots", newSlots);
    };

    return (
        <div className="space-y-4">
            {visibleLevels.map(level => {
                const kvp = slots.find(s => s.level === level)!;
                return (
                    <div key={level} className="flex flex-col min-w-0">
                        <div className="flex flex-wrap items-center gap-1 min-w-0">
                            <span className="w-12 font-semibold">Lv {level}</span>
                            <button
                                onClick={() => removeSlot(level)}
                                className="p-1 rounded hover:bg-gray-200 focus:outline-none text-gray-500"
                                aria-label="Remove slot"
                            >
                                <MinusIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => addSlot(level)}
                                className="p-1 rounded hover:bg-gray-200 focus:outline-none text-gray-500"
                                aria-label="Add slot"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </button>
                            {level === highestLevel && (
                                <button
                                    onClick={() => removeLevel(level)}
                                    className="ml-2 p-1 rounded hover:bg-red-100 focus:outline-none text-red-400"
                                    aria-label="Remove level"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1 pl-8 py-2 min-w-0">
                            {kvp.slots.map((used, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => toggleSlot(level, idx)}
                                    aria-label={`Toggle spell slot ${level}-${idx}`}
                                    className="w-8 h-8"
                                >
                                    <Lottie
                                        animationData={used ? spellAnim : spellUsed}
                                        loop
                                        autoplay
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
            {highestLevel < 9 && (
                <button
                    onClick={addLevel}
                    className="mt-2 text-xs text-blue-400 underline"
                >
                    Add Spell Level
                </button>
            )}
        </div>
    );
}
