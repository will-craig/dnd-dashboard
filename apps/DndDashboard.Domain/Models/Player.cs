using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DndDashboard.Domain.Models;

public class Player 
{
    [Required]
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("hp")]
    public int Hp { get; set; }

    [JsonPropertyName("maxHp")]
    public int MaxHp { get; set; }

    [JsonPropertyName("ac")]
    public int Ac { get; set; }

    [JsonPropertyName("gold")]
    public int Gold { get; set; }

    [JsonPropertyName("image")]
    public string? Image { get; set; }

    [JsonPropertyName("status")]
    public List<string> Status { get; set; } = new();

    [JsonPropertyName("items")]
    public List<Item> Items { get; set; } = new();

}