import { useDispatch, useSelector } from 'react-redux';
import { setSession } from './session.reducers';
import debounce from 'lodash.debounce';
import type { RootState } from './session.store';
import type {Player} from "../../models/Player.ts";
import type {Item} from "../../models/Item.ts";
import {sendSessionUpdate} from "../../services/signalHub.ts";

const debouncedSend = debounce((session) => {
    sendSessionUpdate(session)
        .then(() => console.log(`Session update sent for ${session.id}`))
        .catch(err => console.error(`Failed to send session update for ${session.id}:`, err));
}, 100);

export default function useSessionActions() {
    const dispatch = useDispatch();
    const session = useSelector((state: RootState) => state.session.session);

    // Internal action used by all local updates (will also propagate to server)
    const sessionUpdate = (updatedSession: typeof session) => {
        if (updatedSession) {
            dispatch(setSession(updatedSession));
            debouncedSend(updatedSession);
        }
    };

    // External action used when receiving from SignalR or API
    const sessionFromServerUpdate = (updatedSession: typeof session) => {
        if (updatedSession) {
            dispatch(setSession(updatedSession));
        }
    };

    const updatePlayers = (players: Player[]) => {
        if (!session) return;
        sessionUpdate({ ...session, players });
    };

    const addPlayer = (player: Player) => {
        if (!session) return;
        const players = [...(session.players || []), player];
        updatePlayers(players);
    };

    const updatePlayerField = <K extends keyof Player>(id: number, field: K, value: Player[K]) => {
        if (!session) return;
        const players = session.players.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        );
        updatePlayers(players);
    };

    const addItemToPlayer = (playerId: number, item: Item) => {
        if (!session) return;
        const players = session.players.map(p =>
            p.id === playerId ? { ...p, items: [...p.items, item] } : p
        );
        updatePlayers(players);
    };

    const removeItemFromPlayer = (playerId: number, index: number) => {
        if (!session) return;
        const players = session.players.map(p =>
            p.id === playerId ? { ...p, items: p.items.filter((_, i) => i !== index) } : p
        );
        updatePlayers(players);
    };

    const updateItemForPlayer = (playerId: number, index: number, updatedItem: Item) => {
        if (!session) return;
        const players = session.players.map(p =>
            p.id === playerId ? {
                ...p,
                items: p.items.map((item, i) => (i === index ? updatedItem : item))
            } : p
        );
        updatePlayers(players);
    };

    return {
        session,
        sessionUpdate,
        sessionFromServerUpdate,
        updatePlayers,
        addPlayer,
        updatePlayerField,
        addItemToPlayer,
        removeItemFromPlayer,
        updateItemForPlayer,
    };
}
