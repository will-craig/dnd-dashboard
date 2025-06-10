// src/components/SpellSlots.tsx
import Lottie from "lottie-react";
import spellAnim from "../assets/SpellSlot.json"
import spellUsed from "../assets/SpellSlotUsed.json"
import type { SpellSlots as SpellSlotsModel } from "../models/SpellSlots";
import useSessionActions from "../state/session/useSessionActions.ts";

type SpellSlotsProps = {
    playerId: string;
    slots: SpellSlotsModel;
};

const LEVELS = [1,2,3,4,5,6,7,8,9] as const;

export default function SpellSlots({ playerId, slots }: SpellSlotsProps) {
    const {
        updatePlayerField, // generic field updater
        session,
    } = useSessionActions();

    // Handlers:
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
            <p className="text-lg font-semibold">Spell Slots</p>
            {LEVELS.map((lvl) => {
                const key = `Level${lvl}` as keyof SpellSlotsModel;
                const levelArr = slots[key] || [];
                return (
                    <div key={lvl} className="flex items-center gap-2">
                        <span className="w-12 font-semibold">Lv {lvl}</span>

                        {/* Remove a slot button */}
                        <button
                            onClick={() => removeSlot(lvl)}
                            className="px-2 py-1 bg-red-600 text-white rounded"
                        >
                            –
                        </button>

                        {/* Add a slot button */}
                        <button
                            onClick={() => addSlot(lvl)}
                            className="px-2 py-1 bg-green-600 text-white rounded"
                        > 
                            +
                        </button>

                        {/* Render each slot icon */}
                        <div className="flex gap-1">
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
                    </div>
                );
            })}
        </div>
    );
}
