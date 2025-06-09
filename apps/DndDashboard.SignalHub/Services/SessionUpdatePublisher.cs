using System.Text;
using DndDashboard.Domain.Models;
using Newtonsoft.Json;
using RabbitMQ.Client;

namespace DndDashboard.SignalHub.Services;

public interface ISessionUpdatePublisher
{
    public Task PublishSessionUpdate(Session session);
}

public class SessionUpdatePublisher(string hostName = "localhost"): ISessionUpdatePublisher
{
    private const string QueueName = "session_updates";
    private readonly ConnectionFactory _factory = new() { HostName = hostName };

    public async Task PublishSessionUpdate(Session session)
    {
        await using var connection = await _factory.CreateConnectionAsync();
        await using var channel = await connection.CreateChannelAsync();

        // Declare queue (idempotent)
        await channel.QueueDeclareAsync(
            queue: QueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );
            
        await channel.BasicPublishAsync(
            exchange: string.Empty,
            routingKey: QueueName,
            body: Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(session))
        );
    }
}