using System.ComponentModel.DataAnnotations;
using DndDashboard.Domain.Models;
using System.Text.Json;
using DndDashboard.Api.Configuration;
using DndDashboard.Domain.Services;

var builder = WebApplication.CreateBuilder(args);
builder.ConfigureServices();

var app = builder.Build();
app.ConfigureMiddleware();

var sessionStore = app.Services.GetRequiredService<ISessionStore>();
var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true, WriteIndented = true };

app.MapGet("/session/{id}", async (string id) =>
{
    var session = await sessionStore.GetSessionAsync(id);
    return session is null
        ? Results.NotFound()
        : Results.Json(session);
});

app.MapPost("/session", async (HttpRequest request) =>
{
    using var reader = new StreamReader(request.Body);
    var body = await reader.ReadToEndAsync();
   
    if (string.IsNullOrWhiteSpace(body))
        return Results.BadRequest("Request body is empty");

    try
    {
        var session = JsonSerializer.Deserialize<Session>(body, serializerOptions);

        if (session == null)
            return Results.BadRequest("Request body is not a valid Session object");

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(session);
        if (Validator.TryValidateObject(session, validationContext, validationResults, true))
        {
            return Results.ValidationProblem(validationResults.ToDictionary(
                v => v.MemberNames.FirstOrDefault() ?? "Error",
                v => new[] { v.ErrorMessage ?? "Validation error" }));
        }

        await sessionStore.SaveSessionAsync(session);
        return Results.Ok();
    }
    catch (JsonException)
    {
        return Results.BadRequest("Request body is not valid JSON");
    }
});

app.Run();

