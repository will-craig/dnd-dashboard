using System.Text;
using System.Text.Json;
using DndDashboard.Domain.Models;
using DndDashboard.Domain.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace DndDashboard.Api.Services.QueueHandlers;

public class SessionConsumer(ISessionStore sessionStore, IConfiguration config) : BackgroundService
{
    private readonly ConnectionFactory _factory = new() { HostName = config["RabbitMQHost"] ?? "localhost" };
    private const string QueueName = "session_updates";

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var connection = await _factory.CreateConnectionAsync(stoppingToken);
        var channel = await connection.CreateChannelAsync(cancellationToken: stoppingToken);

        Console.WriteLine($"Connecting to Queue: {QueueName}");
        
        await channel.QueueDeclareAsync(queue: QueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null, cancellationToken: stoppingToken);
        
        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += consumerOnReceivedAsync();

        await channel.BasicConsumeAsync(queue: QueueName, autoAck: true, consumer: consumer, cancellationToken: stoppingToken);
    }

    private AsyncEventHandler<BasicDeliverEventArgs> consumerOnReceivedAsync()
    {
        return async (model, eventArgs) =>
        {
            try
            {
                var body = eventArgs.Body.ToArray();
                var json = Encoding.UTF8.GetString(body);
                var session = JsonSerializer.Deserialize<Session>(json);
                if (session is not null)
                {
                    await sessionStore.SaveSessionAsync(session);
                    Console.WriteLine($"Updated cache for session {session.Id} at {DateTime.UtcNow}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        };
    }
}