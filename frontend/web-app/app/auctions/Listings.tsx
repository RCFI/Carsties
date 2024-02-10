"use client";

import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import queryString from "query-string";

import AuctionCard from "./AuctionCard";
import Filters from "./Filters";
import AppPagination from "../components/AppPagination";
import { getData } from "../actions/auctionActions";

import { Auction } from "@/types";
import { useParamsStore } from "@/hooks/useParamsStore";
import EmptyFilter from "../components/EmptyFilter";
import { useAuctionStore } from "@/hooks/useAuctionStore";

const Listings = () => {
  const [loading, setLoading] = useState(true);
  const params = useParamsStore(
    (state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
      orderBy: state.orderBy,
      filterBy: state.filterBy,
      seller: state.seller,
      winner: state.winner,
    }),
    shallow
  );
  const setParams = useParamsStore((state) => state.setParams);
  const setPageNumber = (pageNumber: number) => setParams({ pageNumber });

  const data = useAuctionStore(
    (state) => ({
      auctions: state.auctions,
      totalCount: state.totalCount,
      pageCount: state.pageCount,
    }),
    shallow
  );
  const setData = useAuctionStore((state) => state.setData);

  const query = queryString.stringifyUrl({ url: "", query: params });

  useEffect(() => {
    getData(query)
      .then((data) => {
        setData(data);
      })
      .finally(() => setLoading(false));
  }, [query, setData]);

  if (loading) return <h3>Loading...</h3>;

  return (
    <>
      <Filters />
      {data.totalCount === 0 ? (
        <EmptyFilter showReset />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6">
            {data &&
              data.auctions.map((auction: Auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
          </div>
          <div className="flex justify-center mt-4">
            <AppPagination
              pageChanged={(nextPageNumber) => setPageNumber(nextPageNumber)}
              currentPage={params.pageNumber}
              pageCount={data.pageCount}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Listings;
