using BiddingService.Consumers;
using BiddingService.Models;
using BiddingService.Services;
using Contracts.Extensions;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MongoDB.Driver;
using MongoDB.Entities;
using Polly;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.UseTelemetry();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["IdentityServiceUrl"];
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters.ValidateAudience = false;
        options.TokenValidationParameters.NameClaimType = "username";
    });

builder.Services.AddMassTransit(x =>
{
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("bids", false));

    x.UsingRabbitMq((context, configurator) =>
    {
        configurator.UseMessageRetry(r =>
        {
            r.Handle<RabbitMqConnectionException>();
            r.Interval(5, TimeSpan.FromSeconds(10));
        });

        configurator.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });
        configurator.ConfigureEndpoints(context);
    });
});

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddHostedService<CheckAuctionFinished>();
builder.Services.AddScoped<GrpcAuctionClient>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await Policy.Handle<TimeoutException>().WaitAndRetryAsync(5, _ => TimeSpan.FromSeconds(10))
    .ExecuteAndCaptureAsync(async () =>
    {
        await DB.InitAsync("BidDb",
            MongoClientSettings.FromConnectionString(builder.Configuration.GetConnectionString("MongoDbConnection")));

        await DB.Index<Bid>()
            .Key(x => x.AuctionId, KeyType.Ascending)
            .Key(x => x.Amount, KeyType.Descending)
            .CreateAsync();
    });

app.Run();