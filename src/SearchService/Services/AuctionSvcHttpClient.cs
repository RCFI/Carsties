using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Services;

public class AuctionSvcHttpClient(HttpClient client, IConfiguration configuration)
{
    private readonly HttpClient _client = client ?? throw new ArgumentNullException(nameof(client));

    private readonly IConfiguration _configuration =
        configuration ?? throw new ArgumentNullException(nameof(configuration));


    public async Task<List<Item>> GetItemsForSearchDb()
    {
        var lastUpdated = await DB.Find<Item, string>().Sort(x => x
                .Descending(i => i.UpdatedAt))
            .Project(x => x.UpdatedAt.ToString())
            .ExecuteFirstAsync();
        
        return await _client.GetFromJsonAsync<List<Item>>($"{_configuration["AuctionServiceUrl"]}/api/auctions?date={lastUpdated}");
    }
}