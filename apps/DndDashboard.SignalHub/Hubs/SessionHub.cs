using DndDashboard.Domain.Models;
using Microsoft.AspNetCore.SignalR;
using DndDashboard.SignalHub.Services;

namespace DndDashboard.SignalHub.Hubs;

public class SessionHub(ISessionUpdatePublisher queue) : Hub
{
    public async Task JoinSession(string sessionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
    }

    // Receive updated session data and broadcast to others
    public async Task UpdateSession(string sessionId, Session updatedSession)
    {
        // Broadcast the updated session to other users
        await Clients.OthersInGroup(sessionId).SendAsync("ReceiveUpdate", updatedSession);
        // publish the updated session to the message queue, and update the session cache
        await queue.PublishSessionUpdate(updatedSession);
    }
}