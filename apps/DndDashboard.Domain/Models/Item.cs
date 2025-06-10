using System.Text.Json.Serialization;

namespace DndDashboard.Domain.Models;

public class Item 
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("magic")]
    public bool Magic { get; set; } = false;
    
    [JsonPropertyName("quantity")]
    public int? Quantity { get; set; }
    
    [JsonPropertyName("type")]
    public string? Type { get; set; } // e.g. item, item-qty, key, ammo
}
