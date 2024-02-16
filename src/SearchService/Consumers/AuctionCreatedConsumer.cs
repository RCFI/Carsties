using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionCreatedConsumer(IMapper mapper, ILogger<AuctionCreatedConsumer> _logger) : IConsumer<AuctionCreated>
{
    private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        _logger.LogInformation($"--> Consuming AuctionCreated {context.Message.Id}");

        var item = _mapper.Map<Item>(context.Message);

        if (item.Model == "Foo") throw new ArgumentException("Can not sell cars with model name of Foo");
        
        await item.SaveAsync();
    }
}