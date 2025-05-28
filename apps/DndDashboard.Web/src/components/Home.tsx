import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pushSession } from "../api/session.client.ts";
import { v4 } from "uuid";

export default function Home() {
    const [partyName, setPartyName] = useState("");
    const navigate = useNavigate();

    const handleCreateSession = async () => {
        const id = v4().replace(/-/g, "").substring(0, 8);
        const session = {
            id: id,
            partyName: partyName,
            players: [],
        };

        try {
            await pushSession(session);
            navigate(`/session/${id}`);
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
            />
            <button
                onClick={handleCreateSession}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Start New Session
            </button>
        </div>
    );
}
