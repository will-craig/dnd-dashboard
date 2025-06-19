using DndDashboard.Domain.Models;
using DndDashboard.Domain.Services;
using Microsoft.AspNetCore.SignalR;

namespace DndDashboard.Api.Services.Hubs;

public class SessionHub(ISessionStore store) : Hub
{
    public async Task JoinSession(string sessionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
    }

    public async Task UpdateSession(Session sessionData)
    {
        await Clients.OthersInGroup(sessionData.Id).SendAsync("ReceiveUpdate", sessionData);
        await store.SaveSessionAsync(sessionData);
    }
}
