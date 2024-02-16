using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class BidPlacedConsumer(ILogger<BidPlacedConsumer> _logger) : IConsumer<BidPlaced>
{
    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        _logger.LogInformation("--> Consuming BidPlaced: AuctionId={0}, BidId={1}, Amount={2}", context.Message.AuctionId,
            context.Message.Id, context.Message.Amount);

        var auction = await DB.Find<Item>().OneAsync(context.Message.AuctionId);

        if (auction.CurrentHighBid == null || context.Message.BidStatus.Contains("Accepted") && context.Message.Amount > auction.CurrentHighBid)
        {
            auction.CurrentHighBid = context.Message.Amount;
            await auction.SaveAsync();
        }
    }
}