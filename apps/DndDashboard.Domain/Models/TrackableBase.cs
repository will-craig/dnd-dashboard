using System.Text.Json.Serialization;

namespace DndDashboard.Domain.Models;

public abstract class TrackableBase
{
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}