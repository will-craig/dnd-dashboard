using System.ComponentModel.DataAnnotations;

namespace DndDashboard.Domain.Models;

public class Session : TrackableBase
{
    [Required]
    public Guid Id { get; set; }
    public string PartyName { get; set; } = string.Empty;
    public List<Player> Players { get; set; } = new();
}