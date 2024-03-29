"use client";
import { useEnvContext } from "next-runtime-env";
import { useEffect, useState } from "react";
import { User } from "next-auth";
import toast from "react-hot-toast";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

import { useAuctionStore } from "@/hooks/useAuctionStore";
import { useBidStore } from "@/hooks/useBidStore";
import { Auction, AuctionFinished, Bid } from "@/types";
import AuctionCreatedToast from "../components/AuctionCreatedToast";
import { getDetailedViewData } from "../actions/auctionActions";
import AuctionFinishedToast from "../components/AuctionFinishedToast";

export type Props = {
  children: React.ReactNode;
  user: User | null;
};

const SignalRProvider = ({ children, user }: Props) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
  const addBid = useBidStore((state) => state.addBid);
  const { NEXT_PUBLIC_NOTIFY_URL } = useEnvContext();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(NEXT_PUBLIC_NOTIFY_URL!)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [setConnection]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to notifications hub");

          connection.on("BidPlaced", (bid: Bid) => {
            console.log("Bid placed", bid);

            if (bid.bidStatus.includes("Accepted")) {
              setCurrentPrice(bid.auctionId, bid.amount);
            }
            addBid(bid);
          });

          connection.on("AuctionCreated", (auction: Auction) => {
            if (user?.username !== auction.seller) {
              return toast(<AuctionCreatedToast auction={auction} />, {
                duration: 10000,
              });
            }
          });

          connection.on(
            "AuctionFinished",
            (finishedAuction: AuctionFinished) => {
              const auction = getDetailedViewData(finishedAuction.auctionId);

              return toast.promise(
                auction,
                {
                  loading: "Loading...",
                  success: (auction) => (
                    <AuctionFinishedToast
                      finishedAuction={finishedAuction}
                      auction={auction}
                    />
                  ),
                  error: (err) => "Auction finished!",
                },
                { success: { duration: 10000, icon: null } }
              );
            }
          );
        })
        .catch((err) => {
          console.log("Error connecting to notifications hub", err);
        });
    }

    return () => {
      connection?.stop();
    };
  }, [connection, setCurrentPrice, addBid, user]);

  return children;
};

export default SignalRProvider;
