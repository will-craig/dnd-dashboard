using System.ComponentModel.DataAnnotations;

namespace DndDashboard.Domain.Models;

public class Item 
{
    [Required]
    public int Id { get; set; } 
    public string Name { get; set; } = string.Empty;
    public bool Magic { get; set; } = false;
    public int? Quantity { get; set; }
    public string? Type { get; set; } // e.g. item, item-qty, key, ammo
}
