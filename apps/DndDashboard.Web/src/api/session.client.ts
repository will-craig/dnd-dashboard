import type {Session} from "../models/Session.ts";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getSession = async (id: string) => {
    const res = await fetch(`${BASE_URL}/session/${id}`);
    if (!res.ok) throw new Error('Failed to load session');
    return res.json();
};

export const pushSession = async (session: Session) => {
    await fetch(`${BASE_URL}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
    });
};