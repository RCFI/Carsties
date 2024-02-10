"use client";

import { useBidStore } from "@/hooks/useBidStore";
import { usePathname } from "next/navigation";
import Countdown, { zeroPad } from "react-countdown";

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  return (
    <div
      className={`
     border-2
     border-white
     text-white
     py-1 px-2 rounded-lg flex justify-center
     ${
       completed
         ? "bg-red-600"
         : days == 0 && hours < 10
         ? "bg-amber-600"
         : "bg-green-600"
     }
  `}
    >
      {completed ? (
        <span>Auction finished</span>
      ) : (
        <span suppressHydrationWarning>
          {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      )}
    </div>
  );
};

export type Props = {
  auctionEnd: string;
};

const CountdownTimer = ({ auctionEnd }: Props) => {
  const setOpen = useBidStore((state) => state.setOpen);
  const pathname = usePathname();

  const auctionFinished = () => {
    if (pathname.startsWith("/auctions/details")) {
      setOpen(false);
    }
  };

  return (
    <div>
      <Countdown
        onComplete={auctionFinished}
        renderer={renderer}
        date={auctionEnd}
      />
    </div>
  );
};

export default CountdownTimer;
