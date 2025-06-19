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
                    policy.WithOrigins(builder.Configuration["Client:Origin"] ?? throw new InvalidOperationException("Client origin not configured"))
                        .WithHeaders("Content-Type", "Authorization")
                        .WithMethods("GET", "POST", "PUT", "DELETE")
                        .AllowCredentials();
            });
        });

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddControllers();
        builder.Services.AddHealthChecks();

        //configure session store cache
        ConfigureSessionStore(builder);
        
        var usingAzureSignalR = builder.Configuration.GetValue<bool>("UseSignalrPaas");

        if (usingAzureSignalR)
        {
            Console.WriteLine("Using Azure SignalR Service");
            builder.Services.AddSignalR().AddAzureSignalR(builder.Configuration["AzureSignalR:Connection"] 
                                                          ?? throw new InvalidOperationException("Azure SignalR connection string not configured"));
        }
        else
        {
            //configure queue consumer to integrate with SignalHubProject [local]
            Console.WriteLine("Configure messaging queues");
            ConfigureMessagingQueueSystem(builder);
        }
        
        return builder;
    }

    private static void ConfigureMessagingQueueSystem(WebApplicationBuilder builder)
    {
        if (builder.Environment.IsDevelopment())
        {
            //Configure Rabbitmq
            builder.Services.AddSingleton<ISessionStore, InMemorySessionStore>();
            builder.Services.AddSingleton<IQueueConsumer>(new RabbitSessionQueue(builder.Configuration["RabbitMq:Host"] ?? "localhost"));
        }
        else
        {
            //Configure Service Bus
            var sbConn = builder.Configuration["ServiceBus:Connection"]
                         ?? throw new InvalidOperationException("SB connection string missing");
            var sbClient = new ServiceBusClient(sbConn);
            builder.Services.AddSingleton<IQueueConsumer>(new ServiceBusQueue(sbClient));
        }
        builder.Services.AddHostedService<SessionConsumer>();
    }

    private static void ConfigureSessionStore(WebApplicationBuilder builder)
    {
        if (builder.Environment.IsDevelopment())
        {
            // Use in-memory store for development
            Console.WriteLine("Using InMemory session store");
            builder.Services.AddSingleton<ISessionStore, InMemorySessionStore>();
        }
        else
        {
            //Configure Redis
            Console.WriteLine("Using Redis session store");
            var redisConnectionString = builder.Configuration["Redis:Connection"] 
                                        ?? throw new InvalidOperationException("Redis connection string not configured");
            var redis = ConnectionMultiplexer.Connect(redisConnectionString);
            builder.Services.AddSingleton<IConnectionMultiplexer>(redis);
            builder.Services.AddSingleton<ISessionStore, RedisSessionStore>();
        }
    }
}