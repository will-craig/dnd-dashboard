using DndDashboard.Api.Helper;

namespace DndDashboard.Api.Tests;

public class GenerateIdTests
{
    [Fact]
    public void GenerateIdCreates16CharString()
    {
        var first = GenerateId.Create();
        var second = GenerateId.Create();

        Assert.Equal(16, first.Length);
        Assert.Equal(16, second.Length);
        Assert.NotEqual(first, second);
    }
}
