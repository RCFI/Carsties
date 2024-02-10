"use server";

import { Auction, Bid, PagedResult } from "@/types";
import { getUserToken } from "./authActions";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { revalidatePath } from "next/cache";

export async function getData(query: string): Promise<PagedResult<Auction>> {
  return await fetchWrapper.get(`search${query}`);
}

export const updateAuctionTest = async () => {
  const data = {
    mileage: Math.floor(Math.random() * 100000) + 1,
  };

  return fetchWrapper.put(
    `auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c`,
    data
  );
};

export const createAuction = async (data: FieldValues) => {
  return fetchWrapper.post(`auctions`, data);
};

export const updateAuction = async (id: string, data: FieldValues) => {
  const res = fetchWrapper.put(`auctions/${id}`, data);
  revalidatePath(`/auctions/${id}`);
  return res;
};

export const getDetailedViewData = async (id: string): Promise<Auction> => {
  return fetchWrapper.get(`auctions/${id}`);
};

export const deleteAuction = async (id: string): Promise<any> => {
  return fetchWrapper.delete(`auctions/${id}`);
};

export const getBidsForAuction = async (id: string): Promise<Bid[]> => {
  return fetchWrapper.get(`bids/${id}`);
};

export const placeBid = async (auctionId: string, amount: number) => {
  return fetchWrapper.post(`bids?auctionId=${auctionId}&amount=${amount}`, {});
};
