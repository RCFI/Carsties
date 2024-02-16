using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionDeletedConsumer(ILogger<AuctionDeletedConsumer> _logger) : IConsumer<AuctionDeleted>
{
    public async Task Consume(ConsumeContext<AuctionDeleted> context)
    {
        _logger.LogInformation("--> Auction deleted: {0}", context.Message.Id);

        await DB.DeleteAsync<Item>(context.Message.Id);
    }
}