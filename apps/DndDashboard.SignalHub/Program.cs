using DndDashboard.SignalHub.Hubs;
using DndDashboard.SignalHub.Services;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = new[] { "http://localhost:5173" }; 

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddSignalR();
builder.Services.AddSingleton<ISessionUpdatePublisher, SessionUpdatePublisher>();

var app = builder.Build();

app.UseRouting();
app.UseCors("CorsPolicy"); 
app.Use(async (context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
    await next();
});

app.MapHub<SessionHub>("/hub/sessionHub");
app.Run();