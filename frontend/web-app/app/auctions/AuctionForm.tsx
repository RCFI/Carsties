"use client";

import toast from "react-hot-toast";
import { useEffect } from "react";
import { Button } from "flowbite-react";
import { FieldValues, useForm } from "react-hook-form";

import Input from "../components/Input";
import DateInput from "../components/DateInput";
import { createAuction, updateAuction } from "../actions/auctionActions";
import { usePathname, useRouter } from "next/navigation";
import { Auction } from "@/types";

export type Props = {
  auction?: Auction;
};

const AuctionForm = ({ auction }: Props) => {
  const {
    handleSubmit,
    setFocus,
    control,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({ mode: "onTouched" });
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (auction) {
      const { make, model, mileage, color, year } = auction;
      reset({ make, model, mileage, color, year });
    }
    setFocus("make");
  }, []);

  const onSubmit = async (data: FieldValues) => {
    let id = "";
    if (pathname === "auctions/create") {
      const res = await createAuction(data);
      if (res.error) {
        toast.error(res.error.status + " " + res.error.message);
        return;
      }
      id = res.id;
    } else {
      const res = await updateAuction(auction!.id, data);
      if (res.error) {
        toast.error(res.error.status + " " + res.error.message);
        return;
      }
      id = auction!.id;
    }

    push(`/auctions/details/${id}`);
  };

  return (
    <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Make"
        name="make"
        control={control}
        rules={{ required: "Make is required" }}
      />
      <Input
        label="Model"
        name="model"
        control={control}
        rules={{ required: "Model is required" }}
      />
      <Input
        label="Color"
        name="color"
        control={control}
        rules={{ required: "Color is required" }}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Year"
          name="year"
          control={control}
          type="number"
          rules={{ required: "Year is required" }}
        />
        <Input
          label="Mileage"
          name="mileage"
          control={control}
          type="number"
          rules={{ required: "Mileage is required" }}
        />
      </div>
      {pathname === "/auctions/create" && (
        <>
          <Input
            label="Image URL"
            name="imageUrl"
            control={control}
            rules={{ required: "Image URL is required" }}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Reserve Price (enter 0 if no reserve)"
              name="reservePrice"
              control={control}
              type="number"
              rules={{ required: "Reserve price is required" }}
            />
            <DateInput
              label="Auction end date/time"
              name="auctionEnd"
              control={control}
              dateFormat="dd MMMM yyyy h:mm a"
              showTimeSelect
              rules={{ required: "Auction end date is required" }}
            />
          </div>
        </>
      )}

      <div className="flex justify-between">
        <Button outline color="gray">
          Cancel
        </Button>
        <Button
          outline
          isProcessing={isSubmitting}
          type="submit"
          disabled={!isValid}
          color="success"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AuctionForm;
