using System.Net;
using DndDashboard.Domain.Models;
using Microsoft.Azure.Cosmos;

namespace DndDashboard.Domain.Services;

public class CosmosSessionStore(Container container) : ISessionStore
{
    public async Task<Session?> GetSessionAsync(string id)
    {
        try
        {
            var response = await container.ReadItemAsync<Session>(id, new PartitionKey(id));
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }
        catch (CosmosException ex)
        {
            Console.WriteLine($"CosmosException in GetSessionAsync: {ex.StatusCode} - {ex.Message}");
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception in GetSessionAsync: {ex.Message}");
            throw;
        }
    }

    public async Task SaveSessionAsync(Session session)
    {
        if (string.IsNullOrWhiteSpace(session.Id))
        {
            throw new ArgumentException("Session.Id must not be null or empty.");
        }
        session.UpdatedAt = DateTime.UtcNow;
        try
        {
            var json = System.Text.Json.JsonSerializer.Serialize(session);
            Console.WriteLine($"Session JSON to upsert: {json}");
            var response = await container.UpsertItemAsync(session, new PartitionKey(session.Id));
            Console.WriteLine($"Upserted session {session.Id} with status code {response.StatusCode}");
        }
        catch (CosmosException ex)
        {
            Console.WriteLine($"CosmosException in SaveSessionAsync: {ex.StatusCode} - {ex.Message}\n{ex}");
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception in SaveSessionAsync: {ex.Message}");
            throw;
        }
    }
}
