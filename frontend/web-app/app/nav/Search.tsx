"use client";
import { useParamsStore } from "@/hooks/useParamsStore";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const router = useRouter();
  const pathname = usePathname();
  const setParams = useParamsStore((state) => state.setParams);
  const setValue = useParamsStore((state) => state.setSearchValue);
  const value = useParamsStore((state) => state.searchValue);

  const onChange = (event: any) => setValue(event.target.value);
  const search = () => {
    if (pathname != "/") {
      router.push("/");
    }
    setParams({ searchTerm: value });
  };

  return (
    <div className="flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm">
      <input
        onChange={onChange}
        value={value}
        onKeyDown={(e: any) => {
          if (e.key === "Enter") {
            search();
          }
        }}
        className="
        flex-grow
        pl-5
        bg-transparent
        focus:outline-none
        border-transparent
        focus:border-transparent
        focus:ring-0
        text-sm
        text-gray-600
      "
        type="text"
        placeholder="Search for cars by make, model or color"
      />
      <button onClick={search}>
        <FaSearch
          size={34}
          className="bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2"
        />
      </button>
    </div>
  );
};

export default Search;
