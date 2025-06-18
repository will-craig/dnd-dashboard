namespace DndDashboard.Api.Services.QueueHandlers;

using Azure.Messaging.ServiceBus;

public sealed class ServiceBusQueue(ServiceBusClient client) : IQueueConsumer
{
    public async Task StartAsync(string queue, Func<string, Task> onMessage, CancellationToken ct)
    {
        var processor = client.CreateProcessor(queue, new ServiceBusProcessorOptions());
        processor.ProcessMessageAsync += async args =>
        {
            await onMessage(args.Message.Body.ToString());
            await args.CompleteMessageAsync(args.Message, ct);
        };
        processor.ProcessErrorAsync += args =>
        {
            Console.WriteLine($"SB error: {args.Exception}");
            return Task.CompletedTask;
        };
        await processor.StartProcessingAsync(ct);
        await Task.Delay(Timeout.Infinite, ct);
    }
}
