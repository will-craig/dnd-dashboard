namespace DndDashboard.Api.Configuration
{
    public static class MiddlewareConfigurator
    {
        public static void ConfigureMiddleware(this WebApplication app)
        {
            app.UseCors("AllowWebApp");
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                Console.WriteLine("Swagger UI is enabled");
            }

        }
    }
}