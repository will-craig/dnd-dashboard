using System.Text;
using System.Text.Json;
using DndDashboard.Domain.Models;
using RabbitMQ.Client;

namespace DndDashboard.SignalHub.Services.QueuePublisher;

public class RabbitMqSessionPublisher(string hostName = "localhost"): IQueuePublisher
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
            body: Encoding.UTF8.GetBytes(JsonSerializer.Serialize(session))
        );
    }
}