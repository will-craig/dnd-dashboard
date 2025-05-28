using DndDashboard.Domain.Services;
using StackExchange.Redis;

namespace DndDashboard.Api.Configuration
{
    public static class ServiceConfigurator
    {
        public static void ConfigureServices(this WebApplicationBuilder builder)
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowWebApp", policy =>
                {
                    var origins = builder.Environment.IsDevelopment()
                        ? new[] { "*"}
                        : new[] { "" }; //TODO: Replace with real domain later

                    policy.WithOrigins(origins)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

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
        }
    }
}