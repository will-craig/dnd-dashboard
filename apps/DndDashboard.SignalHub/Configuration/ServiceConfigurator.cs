using Azure.Messaging.ServiceBus;
using DndDashboard.Domain.Services;
using DndDashboard.SignalHub.Services.QueuePublisher;
using StackExchange.Redis;

namespace DndDashboard.SignalHub.Configuration;

public static class ServiceConfigurator
{
    public static WebApplicationBuilder ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                if(builder.Environment.IsDevelopment())
                    policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                else
                    policy.WithOrigins(builder.Configuration["Client:Origin"] ?? throw new InvalidOperationException("Client origin not configured"))
                        .WithHeaders("Content-Type", "Authorization")
                        .WithMethods("GET", "POST")
                        .AllowCredentials();
            });
        });

        builder.Services.AddHealthChecks();
        builder.Services.AddSignalR(options =>
        {
            options.EnableDetailedErrors = true;
        });
        if (builder.Environment.IsDevelopment())
        {
            var host = builder.Configuration["Rabbit:Host"] ?? "localhost";
            builder.Services.AddSingleton<IQueuePublisher>(_ => new RabbitMqSessionPublisher(host));
        }
        else
        {
            var sbConn = builder.Configuration["ServiceBus:Connection"]
                         ?? throw new InvalidOperationException("SB connection string missing");
            var sbClient = new ServiceBusClient(sbConn);
            builder.Services.AddSingleton<IQueuePublisher>(new ServiceBusSessionPublisher(sbClient));
        }

        return builder;
    }
}