using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace DndDashboard.Api.Services.QueueHandlers;

/// <summary>
/// RabbitMQ is used as a message broker.When running in a container, locally
/// </summary>
public class RabbitSessionQueue(string host) : IQueueConsumer
{
    private readonly ConnectionFactory _factory = new() { HostName = host };

    public async Task StartAsync(string queue, Func<string, Task> onMessage, CancellationToken ct)
    {
        var conn = await _factory.CreateConnectionAsync(ct);   // keep open
        var ch   = await conn.CreateChannelAsync(cancellationToken: ct);
        await ch.QueueDeclareAsync(queue, durable: true, exclusive: false, autoDelete: false, arguments: null, cancellationToken: ct);

        var consumer = new AsyncEventingBasicConsumer(ch);
        consumer.ReceivedAsync += async (_, ea) =>
        {
            var json = Encoding.UTF8.GetString(ea.Body.ToArray());
            await onMessage(json);
        };

        await ch.BasicConsumeAsync(queue, autoAck: true, consumer, ct);
        await Task.Delay(Timeout.Infinite, ct);
    }
}