using System.Text.Json;
using DndDashboard.Domain.Models;
using StackExchange.Redis;

namespace DndDashboard.Domain.Services
{

    public class RedisSessionStore(IConnectionMultiplexer connection) : ISessionStore
    {
        private readonly IDatabase _db = connection.GetDatabase();

        public async Task<Session?> GetSessionAsync(string id)
        {
            var data = await _db.StringGetAsync($"session:{id}");
            if (data.IsNullOrEmpty) return null;

            return JsonSerializer.Deserialize<Session>(data!, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        public async Task SaveSessionAsync(Session session)
        {
            session.UpdatedAt = DateTime.UtcNow;
            var serialized = JsonSerializer.Serialize(session);
            await _db.StringSetAsync($"session:{session.Id}", serialized, TimeSpan.FromDays(20));
        }
    }
}