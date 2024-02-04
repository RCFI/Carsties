export interface PagedResult<T> {
  results: T[]
  pageCount: number
  totalCount: number
}

export interface Auction {
  reservePrice: number
  seller: string
  winner: string | null
  soldAmount: number | null
  currentHighBid: number | null
  createdAt: string
  updatedAt: string
  auctionEnd: string
  status: string
  make: string
  model: string
  year: number
  color: string
  mileage: number
  imageUrl: string
  id: string
}
