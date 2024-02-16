using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class AuctionFinishedConsumer(IHubContext<NotificationHub> hubContext, ILogger<AuctionFinishedConsumer> _logger) : IConsumer<AuctionFinished>
{
    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        _logger.LogInformation("--> Auction finished message received: AuctionId={0}", context.Message.AuctionId);

        await hubContext.Clients.All.SendAsync("AuctionFinished", context.Message);
    }
}