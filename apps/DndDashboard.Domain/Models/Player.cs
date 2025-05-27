namespace DndDashboard.Shared.Models;

public class Player
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Hp { get; set; }
    public int MaxHp { get; set; }
    public int Ac { get; set; }
    public int Gold { get; set; }
    public string? Image { get; set; }
    public List<string> Status { get; set; } = new();
    public List<Item> Items { get; set; } = new();
}