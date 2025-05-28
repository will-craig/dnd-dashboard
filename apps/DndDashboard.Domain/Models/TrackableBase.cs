namespace DndDashboard.Domain.Models;

public abstract class TrackableBase
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}