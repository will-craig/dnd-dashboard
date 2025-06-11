namespace DndDashboard.Domain.Models;

public class SpellSlot
{
    public int Level { get; set; }
    public List<bool> Slots { get; set; } = [];
}