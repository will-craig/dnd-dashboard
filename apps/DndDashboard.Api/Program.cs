using DndDashboard.Api.Configuration;

var app = WebApplication
    .CreateBuilder(args)
    .ConfigureServices()
    .Build()
    .ConfigureMiddleware();

app.Run();
