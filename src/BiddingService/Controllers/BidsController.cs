using AutoMapper;
using BiddingService.DTOs;
using BiddingService.Models;
using BiddingService.Services;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidsController(IMapper mapper, IPublishEndpoint publisher, GrpcAuctionClient client) : ControllerBase
{
    private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    private readonly IPublishEndpoint _publisher = publisher?? throw new ArgumentNullException(nameof(publisher));

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> PlaceBid(string auctionId, decimal amount)
    {
        var auction = await DB.Find<Auction>().OneAsync(auctionId);

        if (auction == null)
        {
            auction = await client.GetAuction(auctionId);

            if (auction == null)
            {
                return BadRequest("Can not accept bids on this auction at this time");
            }

            await auction.SaveAsync();
        }

        if (auction.Seller == User.Identity.Name)
        {
            return BadRequest("You can't place a bid on your own auction");
        }

        var bid = new Bid
        {
            Amount = amount,
            AuctionId = auctionId,
            Bidder = User.Identity.Name,
        };

        if (auction.AuctionEnd < DateTime.UtcNow)
        {
            bid.BidStatus = BidStatus.Finished;
        }
        else
        {
            var highBid = await DB.Find<Bid>()
                .Match(a => a.AuctionId == auctionId)
                .Sort(b => b
                    .Descending(bidSort => bidSort.Amount))
                .ExecuteFirstAsync();

            if (highBid != null && amount > highBid.Amount || highBid == null)
            {
                bid.BidStatus = amount > auction.ReservePrice
                    ? BidStatus.Accepted
                    : BidStatus.AcceptedBelowReserve;
            }

            if (highBid != null && bid.Amount <= highBid.Amount)
            {
                bid.BidStatus = BidStatus.TooLow;
            }
        }

        await DB.SaveAsync(bid);
        await _publisher.Publish(_mapper.Map<BidPlaced>(bid));

        return Ok(_mapper.Map<BidDto>(bid));
    }

    [HttpGet("{auctionId}")]
    public async Task<IActionResult> GetBids(string auctionId)
    {
        var result = await DB.Find<Bid>()
            .Match(b => b.AuctionId == auctionId)
            .Sort(sb => sb
                .Descending(b => b.BidTime))
            .ExecuteAsync();
        
        return Ok(mapper.Map<List<BidDto>>(result));
    }
}