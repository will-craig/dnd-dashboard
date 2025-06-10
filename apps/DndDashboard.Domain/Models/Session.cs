using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DndDashboard.Domain.Models;

public class Session : TrackableBase
{
    [Required]
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("partyName")]
    public string PartyName { get; set; } = string.Empty;

    [JsonPropertyName("players")]
    public List<Player> Players { get; set; } = [];
}