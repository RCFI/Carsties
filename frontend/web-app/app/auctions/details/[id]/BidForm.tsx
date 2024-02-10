"use client";

import { placeBid } from "@/app/actions/auctionActions";
import { useBidStore } from "@/hooks/useBidStore";
import { Bid } from "@/types";
import { FieldValue, FieldValues, useForm } from "react-hook-form";
import { numberWithCommas } from "./BidItem";
import toast from "react-hot-toast";

type Props = {
  auctionId: string;
  highBid: number;
};

const BidForm = ({ auctionId, highBid }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const addBid = useBidStore((state) => state.addBid);

  const onSubmit = async (data: FieldValues) => {
    if (data.amount <= highBid) {
      reset();
      return toast.error(
        "Bid must be at least $" + numberWithCommas(highBid + 1)
      );
    }

    const bid = await placeBid(auctionId, +data.amount);

    if (bid.error) {
      return toast.error(bid.error.message);
    }

    addBid(bid);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center border-2 rounded-lg py-2"
    >
      <input
        type="number"
        {...register("amount")}
        className="custom-input text-sm text-gray-600"
        placeholder={`Enter your bid (minimum bid is $${numberWithCommas(
          highBid + 1
        )})`}
      />
    </form>
  );
};

export default BidForm;
