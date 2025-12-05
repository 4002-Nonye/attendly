import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

function Pagination({ currentPage, totalPages, itemsPerPage, totalItems, onPageChange }) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className='flex items-center justify-between mt-6 px-4'>
      {/* Count  */}
      <div className='text-sm text-gray-600'>
        {startItem}-{endItem} of {totalItems} results
      </div>

      {/* nav Buttons */}
      <div className='flex items-center gap-2'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          aria-label='Previous page'
        >
          <ChevronLeft className='w-5 h-5' />
        </button>

        <span className='text-sm text-gray-600 min-w-[80px] text-center'>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          aria-label='Next page'
        >
          <ChevronRight className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;