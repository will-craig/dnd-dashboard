using System.ComponentModel.DataAnnotations;

namespace DndDashboard.Domain.Models;

public class Session : TrackableBase
{
    public string Id { get; set; }
    public string PartyName { get; set; } = string.Empty;
    public List<Player> Players { get; set; } = new();
}