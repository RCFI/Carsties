using AuctionService.Data;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class BidPlacedConsumer(AuctionDbContext dbContext, ILogger<BidPlacedConsumer> _logger) : IConsumer<BidPlaced>
{
    private readonly AuctionDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        _logger.LogInformation("--> Bid placed: AuctionId={0}, BidId={1}, BidAmount={2}", context.Message.AuctionId,
            context.Message.Id, context.Message.Amount);

        var auction = await _dbContext.Auctions.FindAsync(Guid.Parse(context.Message.AuctionId));

        if (auction.CurrentHighBid == null ||
            context.Message.BidStatus.Contains("Accepted") && context.Message.Amount > auction.CurrentHighBid)
        {
            auction.CurrentHighBid = context.Message.Amount;
            await _dbContext.SaveChangesAsync();
        }
    }
}