﻿using AuctionService;
using BiddingService.Models;
using Grpc.Net.Client;

namespace BiddingService.Services;

public class GrpcAuctionClient(ILogger<GrpcAuctionClient> logger, IConfiguration configuration)
{
    public async Task<Auction> GetAuction(string id)
    {
        logger.LogInformation("Calling GetAuction with id: {id}", id);
        
        var channel = GrpcChannel.ForAddress(configuration["GrpcAuction"]);
        var client = new GrpcAuction.GrpcAuctionClient(channel);
        var request = new GetAuctionRequest { Id = id };

        try
        {
            var reply = await client.GetAuctionAsync(request);
            var auction = new Auction
            {
                ID = reply.Auction.Id,
                AuctionEnd = DateTime.Parse(reply.Auction.AuctionEnd),
                Seller = reply.Auction.Seller,
                ReservePrice = reply.Auction.ReservePrice,
            };

            return auction;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while calling GetAuction");
            return null;
        }
    }
}