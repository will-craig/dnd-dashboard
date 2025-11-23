using DndDashboard.Domain.Models;
using MongoDB.Driver;

namespace DndDashboard.Domain.Services;

public class MongoSessionStore(IMongoCollection<Session> collection) : ISessionStore
{
    public async Task<Session?> GetSessionAsync(string id)
    {
        var filter = Builders<Session>.Filter.Eq(s => s.Id, id);
        return await collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task SaveSessionAsync(Session session)
    {
        session.UpdatedAt = DateTime.UtcNow;
        var filter = Builders<Session>.Filter.Eq(s => s.Id, session.Id);
        await collection.ReplaceOneAsync(filter, session, new ReplaceOptions { IsUpsert = true });
    }
}

