using DndDashboard.Domain.Models;

namespace DndDashboard.Domain.Services;

public class InMemorySessionStore : ISessionStore
{
    private readonly Dictionary<string, Session> _store = new();

    public Task<Session?> GetSessionAsync(string id)
    {
        _store.TryGetValue(id, out var session);
        return Task.FromResult(session);
    }

    public Task SaveSessionAsync(Session session)
    {
        _store[session.Id] = session;
        return Task.CompletedTask;
    }
}