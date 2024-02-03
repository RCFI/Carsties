using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        Console.WriteLine("--> Consuming AuctionFinished: AuctionId={0}, Winner={1}, Amount={2}",
            context.Message.AuctionId, context.Message.Winner, context.Message.Amount);
        
        var auction = await DB.Find<Item>().OneAsync(context.Message.AuctionId);

        if (context.Message.ItemSold)
        {
            auction.Winner = context.Message.Winner;
            auction.SoldAmount = (decimal)context.Message.Amount;
        }

        auction.Status = "Finished";

        await auction.SaveAsync();
    }
}