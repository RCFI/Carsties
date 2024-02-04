"use client"

import { useParamsStore } from "@/hooks/useParamsStore";
import { AiOutlineCar } from "react-icons/ai";

const Logo = () => {
  const reset = useParamsStore(state => state.reset);
  return (
    <div onClick={reset} className="flex items-center gap-2 text-3xl font-semibold text-red-500">
      <AiOutlineCar />
      Carsties Auctions
    </div>
  );
};

export default Logo;
