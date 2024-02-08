using BiddingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BiddingService.Consumers;

public class AuctionCreatedConsumer: IConsumer<AuctionCreated>
{
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine("--> Consuming AuctionCreated: AuctionId={0}, Seller={1}, AuctionEnd={2}, ReservePrice={3}",
            context.Message.Id, context.Message.Seller, context.Message.AuctionEnd, context.Message.ReservePrice);
        
        var auction = new Auction
        {
            ID = context.Message.Id.ToString(),
            Seller = context.Message.Seller,
            AuctionEnd = context.Message.AuctionEnd,
            ReservePrice = context.Message.ReservePrice,
        };

        await auction.SaveAsync();
    }
}