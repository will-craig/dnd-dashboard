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

    public async Task UpdateSession(Session sessionData)
    {
        // Broadcast the updated session to other users
        await Clients.OthersInGroup(sessionData.Id).SendAsync("ReceiveUpdate", sessionData);
        // publish the updated session to the message queue, and update the session cache
        await queue.PublishSessionUpdate(sessionData);
    }
}
