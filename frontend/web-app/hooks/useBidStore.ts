import { Bid } from "@/types";
import { create } from "zustand";

export type State = {
  bids: Bid[];
  open: boolean;
};

export type Actions = {
  setBids: (bids: Bid[]) => void;
  addBid: (bid: Bid) => void;
  setOpen: (open: boolean) => void;
};

export const useBidStore = create<State & Actions>((set) => ({
  bids: [],
  open: true,
  setBids: (bids) => set(() => ({ bids })),
  addBid: (bid) =>
    set((state) => ({
      bids: !state.bids.find((b) => b.id === bid.id)
        ? [bid, ...state.bids]
        : [...state.bids],
    })),
  setOpen: (open) => set(() => ({ open })),
}));
