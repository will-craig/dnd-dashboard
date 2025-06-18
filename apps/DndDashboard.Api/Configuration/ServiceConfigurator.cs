using Azure.Messaging.ServiceBus;
using DndDashboard.Api.Services.QueueHandlers;
using DndDashboard.Domain.Services;
using StackExchange.Redis;

namespace DndDashboard.Api.Configuration;

public static class ServiceConfigurator
{
    public static WebApplicationBuilder ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowWebApp", policy =>
            {
                if(builder.Environment.IsDevelopment())
                    policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                else
                    policy.WithOrigins("TODO: will add with prod value here")
                        .WithHeaders("Content-Type", "Authorization")
                        .WithMethods("GET", "POST", "PUT", "DELETE")
                        .AllowCredentials();
            });
        });

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddControllers();
        builder.Services.AddHealthChecks();

        if (builder.Environment.IsDevelopment())
        {
            builder.Services.AddSingleton<ISessionStore, InMemorySessionStore>();
            builder.Services.AddSingleton<IQueueConsumer>(new RabbitSessionQueue(builder.Configuration["RabbitMq:Host"] ?? "localhost"));
        }
        else
        {
            //Configure Redis
            var redisConnectionString = builder.Configuration["Redis:Connection"] ?? throw new InvalidOperationException("Redis connection string not configured");
            var redis = ConnectionMultiplexer.Connect(redisConnectionString);
            builder.Services.AddSingleton<IConnectionMultiplexer>(redis);
            builder.Services.AddSingleton<ISessionStore, RedisSessionStore>();
            
            //Configure Service Bus
            var sbConn = builder.Configuration["ServiceBus:Connection"]
                         ?? throw new InvalidOperationException("SB connection string missing");
            var sbClient = new ServiceBusClient(sbConn);
            builder.Services.AddSingleton<IQueueConsumer>(new ServiceBusQueue(sbClient));
        }
        builder.Services.AddHostedService<SessionConsumer>();
        return builder;
    }
}