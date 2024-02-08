"use client";

import { deleteAuction } from "@/app/actions/auctionActions";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export type Props = {
  id: string;
};

const DeleteButton = ({ id }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const delAuction = () => {
    setLoading(true);

    deleteAuction(id)
      .then((res) => {
        if (res.error) {
          toast.error(res.error.status + " " + res.error.statusText);
          return;
        }

        router.push("/");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Button color="failure" isProcessing={loading} onClick={delAuction}>
      Delete auction
    </Button>
  );
};

export default DeleteButton;
