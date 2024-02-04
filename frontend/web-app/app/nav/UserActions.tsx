"use client";

import { Dropdown } from "flowbite-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from "react-icons/ai";
import { HiCog, HiUser } from "react-icons/hi2";

export type Props = {
  user: Partial<User>;
};

const UserActions = ({ user }: Props) => (
  <Dropdown inline label={`Welcome ${user.name}`}>
    <Dropdown.Item icon={HiUser}>
      <Link href="/">My auctions</Link>
    </Dropdown.Item>
    <Dropdown.Item icon={AiFillTrophy}>
      <Link href="/">Auctions won</Link>
    </Dropdown.Item>
    <Dropdown.Item icon={AiFillCar}>
      <Link href="/">Sell my car</Link>
    </Dropdown.Item>
    <Dropdown.Item icon={HiCog}>
      <Link href="/session">Session (dev only) </Link>
    </Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item
      onClick={() => signOut({ callbackUrl: "/" })}
      icon={AiOutlineLogout}
    >
      Sign out
    </Dropdown.Item>
  </Dropdown>
);

export default UserActions;
