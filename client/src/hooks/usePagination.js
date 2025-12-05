import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function usePagination(data = [], itemsPerPage = 10) {
  const [searchParams, setSearchParams] = useSearchParams();

  // get current page from url or default to 1
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // calculate pagination values
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() }, { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      const params = Object.fromEntries(searchParams);
      setSearchParams({ ...params, page: '1' });
    }
  }, [currentPage, totalPages, setSearchParams, searchParams]);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData,
    setCurrentPage: handlePageChange,
  };
}
