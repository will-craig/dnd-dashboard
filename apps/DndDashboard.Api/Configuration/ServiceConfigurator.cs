using Azure.Messaging.ServiceBus;
using DndDashboard.Api.Services.QueueHandlers;
using DndDashboard.Domain.Services;
using StackExchange.Redis;
using MongoDB.Driver;

namespace DndDashboard.Api.Configuration;

public static class ServiceConfigurator
{
    public static WebApplicationBuilder ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowWebApp", policy =>
            {
                policy.WithOrigins(builder.Configuration["Client:Origin"] ?? throw new InvalidOperationException("Client origin not configured"))
                    .WithHeaders(
                        "Content-Type",
                        "Authorization",
                        "X-Requested-With",
                        "X-SignalR-User-Agent")
                    .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
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
            var connectionString = builder.Configuration["AzureSignalR:Connection"]
                                    ?? throw new InvalidOperationException("Azure SignalR connection string not configured");
            builder.Services.AddSignalR().AddAzureSignalR(connectionString);
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
        var defaultProvider = builder.Environment.IsDevelopment() ? "InMemory" : "Redis";
        var provider = builder.Configuration["SessionStore:Provider"] ?? defaultProvider;

        switch (provider.ToLowerInvariant())
        {
            case "inmemory":
                Console.WriteLine("Using InMemory session store");
                builder.Services.AddSingleton<ISessionStore, InMemorySessionStore>();
                break;
            case "mongo":
                ConfigureMongoSessionStore(builder);
                break;
            case "redis":
                ConfigureRedisSessionStore(builder);
                break;
            default:
                throw new InvalidOperationException($"Unknown session store provider: {provider}");
        }
    }

    private static void ConfigureMongoSessionStore(WebApplicationBuilder builder)
    {
        Console.WriteLine("Using MongoDB session store");
        var connectionString = builder.Configuration["Mongo:Connection"]
                               ?? throw new InvalidOperationException("MongoDB connection string not configured");
        var databaseName = builder.Configuration["Mongo:Database"]
                           ?? throw new InvalidOperationException("MongoDB database name not configured");
        var collectionName = builder.Configuration["Mongo:Collection"]
                              ?? throw new InvalidOperationException("MongoDB collection name not configured");

        var client = new MongoClient(connectionString);
        var database = client.GetDatabase(databaseName);
        var collection = database.GetCollection<DndDashboard.Domain.Models.Session>(collectionName);

        builder.Services.AddSingleton(collection);
        builder.Services.AddSingleton<ISessionStore, MongoSessionStore>();
    }

    private static void ConfigureRedisSessionStore(WebApplicationBuilder builder)
    {
        Console.WriteLine("Using Redis session store");
        var redisConnectionString = builder.Configuration["Redis:Connection"]
                                    ?? throw new InvalidOperationException("Redis connection string not configured");
        var redis = ConnectionMultiplexer.Connect(redisConnectionString);
        builder.Services.AddSingleton<IConnectionMultiplexer>(redis);
        builder.Services.AddSingleton<ISessionStore, RedisSessionStore>();
    }
}