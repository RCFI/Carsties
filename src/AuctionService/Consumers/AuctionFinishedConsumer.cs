using AuctionService.Data;
using AuctionService.Entities;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionFinishedConsumer(AuctionDbContext dbContext, ILogger<AuctionFinishedConsumer> _logger) : IConsumer<AuctionFinished>
{
    private readonly AuctionDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        _logger.LogInformation("--> Auction finished: {0}", context.Message.AuctionId);
        
        var auction = await _dbContext.Auctions.FindAsync(Guid.Parse(context.Message.AuctionId));

        if (context.Message.ItemSold)
        {
            auction.Winner = context.Message.Winner;
            auction.SoldAmount = context.Message.Amount;
        }

        auction.Status = auction.SoldAmount > auction.ReservePrice ? Status.Finished : Status.ReserveNotMet;
        
        await _dbContext.SaveChangesAsync();
    }
}