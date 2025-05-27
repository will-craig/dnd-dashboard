namespace DndDashboard.Shared.Models;

public class Session
{
    public string Id { get; set; } = string.Empty;
    public List<Player> Players { get; set; } = new();
}