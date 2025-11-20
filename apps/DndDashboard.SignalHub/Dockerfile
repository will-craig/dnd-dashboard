FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["apps/DndDashboard.SignalHub/DndDashboard.SignalHub.csproj", "apps/DndDashboard.SignalHub/"]
RUN dotnet restore "apps/DndDashboard.SignalHub/DndDashboard.SignalHub.csproj"
COPY . .
WORKDIR "/src/apps/DndDashboard.SignalHub"
RUN dotnet build "DndDashboard.SignalHub.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "DndDashboard.SignalHub.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DndDashboard.SignalHub.dll"]
