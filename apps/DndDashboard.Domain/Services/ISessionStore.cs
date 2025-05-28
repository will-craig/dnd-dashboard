using DndDashboard.Domain.Models;

namespace DndDashboard.Domain.Services;

public interface ISessionStore
{
    Task<Session?> GetSessionAsync(string id);
    Task SaveSessionAsync(Session session);
}