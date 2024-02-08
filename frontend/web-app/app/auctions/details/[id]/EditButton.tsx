import { Button } from "flowbite-react";
import Link from "next/link";

export type Props = {
  id: string;
};

const EditButton = ({ id }: Props) => (
  <Button outline>
    <Link href={`/auctions/update/${id}`}>Update auction</Link>
  </Button>
);

export default EditButton;
