using AuctionService.DTO;
using AuctionService.Entities;
using AutoMapper;
using Contracts;

namespace AuctionService.RequestHelpers;

public class MappingsProfiles : Profile
{
    public MappingsProfiles()
    {
        CreateMap<Auction, AuctionDto>().IncludeMembers(x => x.Item);
        CreateMap<Item, AuctionDto>();
        CreateMap<CreateAuctionCommand, Auction>()
            .ForMember(x => x.Item, o => o
                .MapFrom(x => x));
        CreateMap<CreateAuctionCommand, Item>();

        CreateMap<UpdateAuctionCommand, Auction>()
            .ForMember(x => x.Item, o => o
                .MapFrom(s => s));
        CreateMap<UpdateAuctionCommand, Item>();

        CreateMap<AuctionDto, AuctionCreated>();
    }
}