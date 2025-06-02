using DndDashboard.Domain.Models;
using DndDashboard.Domain.Services;
using Microsoft.AspNetCore.SignalR;

namespace DndDashboard.SignalHub.Hubs;

public class SessionHub(ISessionStore store) : Hub
{
    // Join a group for a specific sessionId
    public async Task JoinSession(string sessionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
    }

    // Receive updated session data and broadcast to others
    public async Task UpdateSession(string sessionId, Session updatedSession)
    {
        // Broadcast the updated session to other users
        await Clients.OthersInGroup(sessionId).SendAsync("ReceiveUpdate", updatedSession);

        // TODO Save to Redis (do via queue)
        await store.SaveSessionAsync(updatedSession);
    }
}