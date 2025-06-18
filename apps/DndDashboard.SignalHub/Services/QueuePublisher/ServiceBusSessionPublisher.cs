using System.Text.Json;
using Azure.Messaging.ServiceBus;
using DndDashboard.Domain.Models;

namespace DndDashboard.SignalHub.Services.QueuePublisher;

public class ServiceBusSessionPublisher(ServiceBusClient client): IQueuePublisher
{
    private const string QueueName = "session_updates";
    public async Task PublishSessionUpdate(Session session)
    {
        await using var sender = client.CreateSender(QueueName);
        var payload = JsonSerializer.Serialize(session);
        await sender.SendMessageAsync(new ServiceBusMessage(payload));
    }
}