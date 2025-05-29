namespace DndDashboard.Api.Helper;

public static class GenerateId
{
    public static string Create() => Guid.NewGuid()
        .ToString()
        .Replace("-", string.Empty)
        .Substring(0, 16);
}