import {HubConnectionBuilder, HubConnection, LogLevel} from "@microsoft/signalr";
import type { Session } from "../models/Session.ts";

const SESSION_HUB_URL: string = `${import.meta.env.VITE_SIGNAL_HUB_BASE_URL}/hub/sessionHub`;
let connection: HubConnection | null = null;

export async function connectToSessionHub(sessionId: string, onUpdate: (session: Session) => void) {
    connection = new HubConnectionBuilder()
        .withUrl(SESSION_HUB_URL, {
            withCredentials: true
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

    connection.on("ReceiveUpdate", onUpdate);

    try {
        await connection.start();
        console.log("SignalR connected");
        await connection.invoke("JoinSession", sessionId);
        console.log(`Joined session ${sessionId}`);
    } catch (err) {
        console.error("SignalR connection failed:", err);
    }
}

export async function sendSessionUpdate(sessionId: string, session: Session) {
    if (connection && connection.state === "Connected") {
        await connection.invoke("UpdateSession", sessionId, session);
    }
}


export function stopSessionHub() {
    if (connection) {
        connection.stop()
            .then(() => console.log("SignalR connection stopped"))
            .catch(err => console.error("Error stopping connection:", err));
        connection = null;
    }
}