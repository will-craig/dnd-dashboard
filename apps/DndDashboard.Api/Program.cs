using DndDashboard.Api.Configuration;

var builder = WebApplication.CreateBuilder(args);
builder.ConfigureServices();

var app = builder.Build();
app.ConfigureMiddleware();

app.MapHealthChecks("/health");
app.UseCors("AllowWebApp");
app.Run();
