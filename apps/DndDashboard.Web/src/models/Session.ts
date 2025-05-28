import type {Player} from "./Player.ts";

export type Session = {
    id: string;
    partyName: string;
    players: Player[];
}