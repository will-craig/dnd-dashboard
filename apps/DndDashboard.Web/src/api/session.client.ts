import type {Session} from "../models/Session.ts";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function pullSession(id: string): Promise<Session> {
    const response = await fetch(`${BASE_URL}/api/session/${id}`);
    if (!response.ok) throw new Error("Failed to fetch session");
    return await response.json();
}

export async function pushSession(session: Session): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/session/${session.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
    });

    if (response.status !== 204) 
        throw new Error("Failed to update session");
}

export async function createSession(partyName: string): Promise<string> {
    const response = await fetch(`${BASE_URL}/api/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partyName),
    });

    if (response.status !== 201) 
        throw new Error("Failed to create session");

    return await response.text();
}

