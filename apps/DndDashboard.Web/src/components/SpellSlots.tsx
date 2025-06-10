// src/components/SpellSlots.tsx
import Lottie from "lottie-react";
import spellAnim from "../assets/SpellSlot.json"
import spellUsed from "../assets/SpellSlotUsed.json"
import type { SpellSlots as SpellSlotsModel } from "../models/SpellSlots";
import useSessionActions from "../state/session/useSessionActions.ts";
import {useState} from "react";
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'; // If using Heroicons


type SpellSlotsProps = {
    playerId: string;
    slots: SpellSlotsModel;
};

export default function SpellSlots({ playerId, slots }: SpellSlotsProps) {
    const {
        updatePlayerField, 
        session,
    } = useSessionActions();
    // Tracks which levels are currently shown in the UI
    const [visibleLevels, setVisibleLevels] = useState<number[]>(() => {
        // Show Level 1 if present, otherwise empty
        return slots.Level1 ? [1] : [];
    });
    // Handlers:
    // Find the highest visible level, for controlling add button
    const highestLevel = visibleLevels.length ? Math.max(...visibleLevels) : 1;

    const addLevel = () => {
        if (highestLevel >= 9) return;
        const next = highestLevel + 1;
        setVisibleLevels(levels => [...levels, next]);
        // Optionally, initialize empty array in the model if not present
        const key = `Level${next}` as keyof SpellSlotsModel;
        if (!(slots[key] && slots[key].length >= 0)) {
            updatePlayerField(playerId, "spellSlots", {
                ...slots,
                [key]: [],
            });
        }
    };
    
    const removeLevel = (lvl: number) => {
        setVisibleLevels(levels => levels.filter(l => l !== lvl));
    };
    
    const addSlot = (level: number) => {
        if (!session) return;
        const key = `Level${level}` as keyof SpellSlotsModel;
        const arr = slots[key] || [];
        updatePlayerField(playerId, "spellSlots", {
            ...slots,
            [key]: [...arr, true],
        });
    };

    const removeSlot = (level: number) => {
        if (!session) return;
        const key = `Level${level}` as keyof SpellSlotsModel;
        const arr = slots[key] || [];
        if (arr.length === 0) return;
        updatePlayerField(playerId, "spellSlots", {
            ...slots,
            [key]: arr.slice(0, -1),
        });
    };

    const toggleSlot = (level: number, idx: number) => {
        if (!session) return;
        const key = `Level${level}` as keyof SpellSlotsModel;
        const arr = slots[key].slice();
        arr[idx] = !arr[idx];
        updatePlayerField(playerId, "spellSlots", {
            ...slots,
            [key]: arr,
        });
    };

    return (
        <div className="space-y-4">
            {visibleLevels.map(lvl => {
                const key = `Level${lvl}` as keyof SpellSlotsModel;
                const levelArr = slots[key] || [];
                return (
                    <div key={lvl} className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="w-12 font-semibold">Lv {lvl}</span>
                            {/* Minus slot */}
                            <button
                                onClick={() => removeSlot(lvl)}
                                className="p-1 rounded hover:bg-gray-200 focus:outline-none text-gray-500"
                                aria-label="Remove slot"
                            >
                                <MinusIcon className="w-4 h-4" />
                            </button>
                            {/* Plus slot */}
                            <button
                                onClick={() => addSlot(lvl)}
                                className="p-1 rounded hover:bg-gray-200 focus:outline-none text-gray-500"
                                aria-label="Add slot"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </button>
                            {/* Remove Level (only >1) */}
                            {lvl > 1 && (
                                <button
                                    onClick={() => removeLevel(lvl)}
                                    className="ml-2 p-1 rounded hover:bg-red-100 focus:outline-none text-red-400"
                                    aria-label="Remove level"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        {levelArr.length > 0 && (
                            <div className="flex gap-1 pl-8 py-2">
                                {levelArr.map((used, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => toggleSlot(lvl, idx)}
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
                        )}
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
