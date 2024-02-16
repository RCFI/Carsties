using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class AuctionCreatedConsumer(IHubContext<NotificationHub> hubContext, ILogger<AuctionCreatedConsumer> _logger) : IConsumer<AuctionCreated>
{
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        _logger.LogInformation("--> Auction created message received: AuctionId={0}", context.Message.Id);

        await hubContext.Clients.All.SendAsync("AuctionCreated", context.Message);
    }
}