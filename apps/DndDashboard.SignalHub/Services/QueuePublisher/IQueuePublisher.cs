using DndDashboard.Domain.Models;

namespace DndDashboard.SignalHub.Services.QueuePublisher;

public interface IQueuePublisher
{
    Task PublishSessionUpdate(Session session);
}