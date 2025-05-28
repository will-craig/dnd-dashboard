import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import PlayerCard from './PlayerCard/PlayerCard';
import type { Player } from '../models/Player';
import {getSession, pushSession} from "../api/session.client.ts";
import type {Session} from "../models/Session.ts";
import type {Item} from "../models/Item.ts";

export default function Dashboard() {
    const { id } = useParams();
    const [session, setSession] = useState<Session | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['session', id],
        queryFn: () => getSession(id!),
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: pushSession,
    });

    useEffect(() => {
        if (data) {
            setSession(data);
            setPlayers(data.players || []);
        }
    }, [data]);

    useEffect(() => {
        if (session) {
            mutation.mutate({ ...session, players: players });
        }
    }, [players]);

    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerHP, setNewPlayerHP] = useState(40);

    const addItemToPlayer = (playerId: number, item: Item) => {
        setPlayers(prev =>
            prev.map(p =>
                p.id === playerId
                    ? { ...p, items: [...p.items, item] }
                    : p
            )
        );
    };

    const removeItemFromPlayer = (playerId: number, index: number) => {
        setPlayers(prev =>
            prev.map(p =>
                p.id === playerId
                    ? { ...p, items: p.items.filter((_, i) => i !== index) }
                    : p
            )
        );
    };

    const updateItemForPlayer = (playerId: number, index: number, updatedItem: Item) => {
        setPlayers(prev =>
            prev.map(p =>
                p.id === playerId
                    ? {
                        ...p,
                        items: p.items.map((item, i) => (i === index ? updatedItem : item))
                    }
                    : p
            )
        );
    };

    const addPlayer = () => {
        if (!newPlayerName.trim()) return;
        const newPlayer: Player = {
            id: Date.now(),
            name: newPlayerName.trim(),
            hp: newPlayerHP,
            ac: 10,
            gold: 0,
            maxHp: newPlayerHP,
            status: [],
            items: []
        };
        setPlayers([...players, newPlayer]);
        setNewPlayerName('');
        setNewPlayerHP(40);
    };

    const updatePlayerField = <key extends keyof Player>(
        id: number,
        field: key,
        value: Player[key]
    ) => {
        setPlayers(prev =>
            prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    if (isLoading) return <div className="p-6 text-white">Loading...</div>;
    if (error || !session) return <div className="p-6 text-red-500">Failed to load session.</div>;

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-6">
            <input
                type="text"
                value={session.partyName}
                onChange={(e) => setSession({ ...session, partyName: e.target.value })}
                className="text-3xl font-bold mb-6 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl2:grid-cols-6 gap-6">
                {players.map((p) => (
                    <PlayerCard
                        key={p.id}
                        player={p}
                        handlers={{
                            onUpdateHp: (id, hp) => updatePlayerField(id, 'hp', hp),
                            onUpdateMaxHp: (id, maxHp) => updatePlayerField(id, 'maxHp', maxHp),
                            onUpdateName: (id, name) => updatePlayerField(id, 'name', name),
                            onUpdateGold: (id, gold) => updatePlayerField(id, 'gold', gold),
                            onUpdateAc: (id, ac) => updatePlayerField(id, 'ac', ac),
                            onUpdateImage: (id, image) => updatePlayerField(id, 'image', image),
                            onUpdateConditions: (id, conditions) => updatePlayerField(id, 'status', conditions),
                            onAddItem: addItemToPlayer,
                            onRemoveItem: removeItemFromPlayer,
                            onUpdateItem: updateItemForPlayer,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
