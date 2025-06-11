import type {Player} from "../models/Player.ts";
import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import PlayerCard from './PlayerCard/PlayerCard';
import useSessionActions from "../state/session/useSessionActions.ts";
import {connectToSessionHub, stopSessionHub} from "../services/signalHub.ts";
import {pullSession} from "../clients/session.client.ts";
import {useQuery} from "@tanstack/react-query";

export default function Dashboard() {
    const { id } = useParams();
    const { session, sessionFromServerUpdate, addPlayer, sessionUpdate } = useSessionActions();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['session', id],
        queryFn: () => pullSession(id!),
        enabled: !!id,
    });
    
    useEffect(() => {
        if (data) {
            sessionFromServerUpdate(data);
        }
    }, [data]);
    
    useEffect(() => {
        if (id) {
            connectToSessionHub(id, sessionFromServerUpdate)
                .then(() => console.log('dashboard connectToSessionHub complete'))
                .catch(() => console.log('dashboard connectToSessionHub failed'));
        }
        return () => {
            stopSessionHub();
        };
    }, [id]);

    const players = session?.players || [];

    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerHP, setNewPlayerHP] = useState(10);

    const handleAddPlayer = () => {
        const newPlayer = {
            id: Date.now().toString(),
            name: newPlayerName,
            hp: newPlayerHP,
            maxHp: newPlayerHP,
            gold: 0,
            ac: 10,
            image: '',
            items: [],
            status: [],
            spellSlots: [{ level: 1, slots: [true] }], // Default to one level 1 spell slot
        };
        addPlayer(newPlayer);
    };

    if (isLoading) return <div className="p-6 text-white">Loading...</div>;
    
    if (error || !session) return <div className="p-6 text-red-500">Failed to load session.</div>;
    
    return (
        <div className="min-h-screen bg-zinc-900 text-white p-6">
            <input
                type="text"
                value={session.partyName}
                onChange={(e) => sessionUpdate({ ...session, partyName: e.target.value })}
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
                    onClick={handleAddPlayer}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                >
                    Add Player
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl2:grid-cols-6 gap-6">
                {players.map((player: Player) => (
                    <PlayerCard
                        key={player.id}
                        player={player}
                    />
                ))}
            </div>
        </div>
    );
}
