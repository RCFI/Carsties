"use client";

import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import queryString from "query-string";

import AuctionCard from "./AuctionCard";
import Filters from "./Filters";
import AppPagination from "../components/AppPagination";
import { getData } from "../actions/auctionActions";

import { Auction, PagedResult } from "@/types";
import { useParamsStore } from "@/hooks/useParamsStore";
import EmptyFilter from "../components/EmptyFilter";

const Listings = () => {
  const [data, setData] = useState<PagedResult<Auction>>();
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

  const query = queryString.stringifyUrl({ url: "", query: params });

  useEffect(() => {
    getData(query).then((data) => {
      setData(data);
    });
  }, [query]);

  if (!data) return <h3>Loading...</h3>;

  return (
    <>
      <Filters />
      {data.totalCount === 0 ? (
        <EmptyFilter showReset />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6">
            {data &&
              data.results.map((auction: Auction) => (
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
