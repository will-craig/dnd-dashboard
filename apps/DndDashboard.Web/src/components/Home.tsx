import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {createSession} from "../clients/session.client.ts";

export default function Home() {
    const [partyName, setPartyName] = useState("");
    const navigate = useNavigate();

    const handleCreateSession = async () => {
        if (!partyName.trim()) return;

        try {
            const newSessionId = await createSession(partyName);
            navigate(`/session/${newSessionId}`);
        } catch (err) {
            console.error("Failed to create session", err);
            alert("Failed to create session.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <h1 className="text-3xl font-bold">D&D Dashboard</h1>
            <input
                type="text"
                placeholder="Enter Party Name"
                className="border rounded px-4 py-2"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                aria-label="Party name"
            />
            <button
                onClick={handleCreateSession}
                aria-label="Start session"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Start New Session
            </button>
        </div>
    );
}
