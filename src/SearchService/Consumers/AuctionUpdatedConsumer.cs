using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionUpdatedConsumer(IMapper mapper, ILogger<AuctionUpdatedConsumer> _logger) : IConsumer<AuctionUpdated>
{
    private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        _logger.LogInformation("--> Auction updated: {0}", context.Message.Id);

        var item = await DB.Find<Item>().Match(x => x.ID == context.Message.Id).ExecuteFirstAsync();

        _mapper.Map(context.Message, item);

        await item.SaveAsync();
    }
}