import { getDetailedViewData } from "@/app/actions/auctionActions";
import Heading from "@/app/components/Heading";
import AuctionForm from "../../AuctionForm";

const UpdateAuction = async ({ params }: { params: { id: string } }) => {
  const data = await getDetailedViewData(params.id);

  return (
    <div className="mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg">
      <Heading
        title="Update your auction"
        subtitle="Please update details of your car"
      />
      <AuctionForm auction={data} />
    </div>
  );
};

export default UpdateAuction;
