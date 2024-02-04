"use client";

import { Pagination } from "flowbite-react";
import { useState } from "react";

type Props = {
  currentPage: number;
  pageCount: number;
  pageChanged: (page: number) => void;
};

const AppPagination = ({ currentPage, pageCount, pageChanged }: Props) => (
  <Pagination
    currentPage={currentPage}
    onPageChange={pageChanged}
    totalPages={pageCount}
    layout="pagination"
    showIcons
    className="text-blue-500 mb-5"
  />
);

export default AppPagination;
