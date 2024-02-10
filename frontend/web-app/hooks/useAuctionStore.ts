import { Auction, PagedResult } from "@/types";
import { create } from "zustand";

type State = {
  auctions: Auction[];
  totalCount: number;
  pageCount: number;
};

type Actions = {
  setData: (data: PagedResult<Auction>) => void;
  setCurrentPrice: (auctionId: string, amount: number) => void;
};

const initialState: State = {
  auctions: [],
  totalCount: 0,
  pageCount: 0,
};

export const useAuctionStore = create<State & Actions>((set) => ({
  ...initialState,
  setData: (data) => {
    set({
      auctions: data.results,
      totalCount: data.totalCount,
      pageCount: data.pageCount,
    });
  },
  setCurrentPrice: (auctionId, amount) => {
    set((state) => ({
      auctions: state.auctions.map((a) =>
        a.id === auctionId ? { ...a, currentHighBid: amount } : a
      ),
    }));
  },
}));
