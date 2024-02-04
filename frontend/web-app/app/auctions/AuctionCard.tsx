import { Auction } from "@/types";
import CarImage from "./CartImage";
import CountdownTimer from "./CountdownTimer";

export type Props = {
  auction: Auction;
};

const AuctionCard = ({ auction }: Props) => (
  <a href="#" className="group">
    <div className="w-full bg-gray-200 aspect-w-16 aspect-h-10 rounded-lg overflow-hidden">
      <div>
        <CarImage imageUrl={auction.imageUrl} />
        <div className="absolute bottom-2 left-2">
          <CountdownTimer auctionEnd={auction.auctionEnd} />
        </div>
      </div>
    </div>
    <div className="flex justify-between items-center mt-4">
      <h3 className="text-gray-700">
        {auction.make} {auction.model}
      </h3>
      <p className="font-semibold text-sm">{auction.year}</p>
    </div>
  </a>
);

export default AuctionCard;