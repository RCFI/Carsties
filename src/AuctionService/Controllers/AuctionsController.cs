using AuctionService.Data;
using AuctionService.DTO;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController(AuctionDbContext dbContext, IMapper mapper, IPublishEndpoint publishEndpoint) : ControllerBase
{
    private readonly AuctionDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    private readonly IPublishEndpoint _publishEndpoint = publishEndpoint?? throw new ArgumentNullException(nameof(publishEndpoint));

    [HttpGet]
    public async Task<IActionResult> GetAllAuctions(string date)
    {
        var query = _dbContext.Auctions
            .OrderBy(x => x.Item.Make)
            .ThenBy(x => x.Item.Model)
            .AsQueryable();

        if (!string.IsNullOrEmpty(date))
        {
           query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
        }

        return Ok(await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAuctionById(Guid id)
    {
        var auction = await _dbContext.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(a => a.Id == id);
        
        if (auction == null)
        {
            return NotFound();
        }

        var auctionDto = _mapper.Map<AuctionDto>(auction);
        return Ok(auctionDto);
    }
    
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateAuction(CreateAuctionCommand createAuctionCommand)
    {
        var auction = _mapper.Map<Auction>(createAuctionCommand);

        auction.Seller = User.Identity.Name;
        
        _dbContext.Auctions.Add(auction);
        var newAuction = _mapper.Map<AuctionDto>(auction);
        await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

        var result = await _dbContext.SaveChangesAsync() > 0;
        
        if (result)
        {
            return CreatedAtAction(nameof(GetAuctionById), new { id = auction.Id }, newAuction);
        }
        
        return BadRequest("Could not save changes to DB");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAuction(Guid id, UpdateAuctionCommand updateAuctionCommand)
    {
        var auction = await _dbContext.Auctions
            .Include(a => a.Item)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (auction == null)
        {
            return NotFound();
        }

        if (auction.Seller != User.Identity.Name)
        {
            return Forbid();
        }

        auction.Item.Make = updateAuctionCommand.Make ?? auction.Item.Make;
        auction.Item.Model = updateAuctionCommand.Model?? auction.Item.Model;
        auction.Item.Year = updateAuctionCommand.Year ?? auction.Item.Year;
        auction.Item.Mileage = updateAuctionCommand.Mileage ?? auction.Item.Mileage;
        auction.Item.Color = updateAuctionCommand.Color ?? auction.Item.Color;
        
        _dbContext.Update(auction);

        var auctionUpdated = _mapper.Map<AuctionUpdated>(auction.Item);
        auctionUpdated.Id = auction.Id.ToString();
        await _publishEndpoint.Publish(auctionUpdated);

        var result = await _dbContext.SaveChangesAsync() > 0;
        
        if (result)
        {
            return Ok();
        }

        return BadRequest("Could not save changes to DB");
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAuction(Guid id)
    {
        var auction = await _dbContext.Auctions.FindAsync(id);
        if (auction == null)
        {
            return NotFound();
        }

        if (auction.Seller != User.Identity.Name)
        {
            return Forbid();
        }
        
        _dbContext.Auctions.Remove(auction);
        
        await publishEndpoint.Publish(new AuctionDeleted { Id = auction.Id.ToString() });
        
        var result = await _dbContext.SaveChangesAsync() > 0;
        
        if (result)
        {
            return Ok();
        }
        
        return BadRequest("Could not save changes to DB");
    }
}