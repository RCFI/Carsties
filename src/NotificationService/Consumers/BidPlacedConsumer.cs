﻿using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class BidPlacedConsumer(IHubContext<NotificationHub> hubContext) : IConsumer<BidPlaced>
{
    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("--> Bid placed for auction: AuctionId={0} Amount={1} Bidder={2}", context.Message.AuctionId,
            context.Message.Amount, context.Message.Bidder);

        await hubContext.Clients.All.SendAsync("BidPlaced", context.Message);
    }
}