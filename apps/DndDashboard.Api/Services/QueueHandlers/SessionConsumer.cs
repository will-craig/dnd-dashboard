using System.Text;
using System.Text.Json;
using DndDashboard.Domain.Models;
using DndDashboard.Domain.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace DndDashboard.Api.Services.QueueHandlers;

using System.Text.Json;
using DndDashboard.Domain.Services;

public sealed class SessionConsumer(ISessionStore store, IQueueConsumer queue) : BackgroundService
{
    private const string QueueName = "session_updates";

    protected override Task ExecuteAsync(CancellationToken stoppingToken) => 
        queue.StartAsync(QueueName, async msg =>
        {
            try
            {
                var session = JsonSerializer.Deserialize<Session>(msg);
                if (session is not null)
                {
                    await store.SaveSessionAsync(session);
                    Console.WriteLine($"Cached session {session.Id} at {DateTime.UtcNow}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SessionConsumer error: {ex}");
            }
        }, stoppingToken);
}