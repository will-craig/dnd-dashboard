using DndDashboard.SignalHub.Hubs;
using DndDashboard.SignalHub.Services;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = new[] { "http://localhost:5173" }; 

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        if(builder.Environment.IsDevelopment())
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        else
            policy.WithOrigins("TODO: will add with prod value here")
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
builder.Services.AddSingleton<ISessionUpdatePublisher, SessionUpdatePublisher>();

var app = builder.Build();

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