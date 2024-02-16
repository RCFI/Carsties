using System.Globalization;
using AuctionService.Data;
using Grpc.Core;

namespace AuctionService.Services;

public class GrpcAuctionService(AuctionDbContext dbContext, ILogger<GrpcAuctionService> _logger) : GrpcAuction.GrpcAuctionBase
{
    public override async Task<GrpcAuctionResponse> GetAuction(GetAuctionRequest request, ServerCallContext context)
    {
        _logger.LogInformation("==> Received GetAuction request");

        var auction = await dbContext.Auctions.FindAsync(Guid.Parse(request.Id));

        if (auction == null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, "Not found"));
        }

        var response = new GrpcAuctionResponse
        {
            Auction = new GrpcAuctionModel
            {
                Id = auction.Id.ToString(),
                AuctionEnd = auction.AuctionEnd.ToString(CultureInfo.InvariantCulture),
                ReservePrice = (int)auction.ReservePrice,
                Seller = auction.Seller
            }
        };

        return response;
    }
}