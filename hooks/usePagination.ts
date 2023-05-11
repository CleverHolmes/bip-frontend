import React, { useState } from 'react';

type Props = {
  total?: number;
};

export const usePagination = (props?: Props) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;
  const totalPages = props?.total || 0;

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  return {
    handleChangePage,
    page,
    itemsPerPage,
    totalPages,
  };
};
