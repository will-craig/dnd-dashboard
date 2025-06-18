using DndDashboard.SignalHub.Configuration;
using DndDashboard.SignalHub.Services.Hubs;

var app = WebApplication
    .CreateBuilder(args)
    .ConfigureServices()
    .Build();

app.UseRouting();
app.MapHealthChecks("/health");
app.UseCors("CorsPolicy"); 
app.Use(async (context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
    await next();
});

app.MapHub<SessionHub>("/hub/sessionHub");
app.Run();