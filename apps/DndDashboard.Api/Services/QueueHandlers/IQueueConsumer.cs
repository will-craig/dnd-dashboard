namespace DndDashboard.Api.Services.QueueHandlers;

public interface IQueueConsumer
{
    Task StartAsync(string queueName, Func<string,Task> onMessage, CancellationToken ct);
}