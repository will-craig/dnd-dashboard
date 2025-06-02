using DndDashboard.Domain.Services;
using DndDashboard.SignalHub.Hubs;
using StackExchange.Redis;

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

// TODO: maybe move this in seperate service update via que
if (builder.Environment.IsDevelopment())
    builder.Services.AddSingleton<ISessionStore, InMemorySessionStore>();
else
{
    var redisConnectionString = builder.Configuration["RedisConnection"]
                                ?? throw new InvalidOperationException("Redis connection string not configured");

    var redis = ConnectionMultiplexer.Connect(redisConnectionString);
    builder.Services.AddSingleton<IConnectionMultiplexer>(redis);
    builder.Services.AddSingleton<ISessionStore, RedisSessionStore>();
}

builder.Services.AddSignalR();

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