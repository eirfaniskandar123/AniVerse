
import React from 'react';
import { PaginationData } from '../types';

interface PaginationProps {
  pagination: PaginationData | null;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.last_visible_page <= 1) {
    return null;
  }

  const { current_page, last_visible_page, has_next_page } = pagination;

  const handlePrev = () => {
    if (current_page > 1) {
      onPageChange(current_page - 1);
    }
  };

  const handleNext = () => {
    if (has_next_page) {
      onPageChange(current_page + 1);
    }
  };

  const pages = [];
  const pageLimit = 5;
  let startPage = Math.max(1, current_page - Math.floor(pageLimit / 2));
  let endPage = startPage + pageLimit - 1;

  if (endPage > last_visible_page) {
    endPage = last_visible_page;
    startPage = Math.max(1, endPage - pageLimit + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center space-x-2 my-8">
      <button
        onClick={handlePrev}
        disabled={current_page === 1}
        className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
      >
        Prev
      </button>

      {startPage > 1 && (
        <>
            <button onClick={() => onPageChange(1)} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-purple-600 transition-colors">1</button>
            {startPage > 2 && <span className="px-4 py-2 text-gray-500">...</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md transition-colors ${
            current_page === page
              ? 'bg-purple-600 text-white font-bold'
              : 'bg-gray-800 text-white hover:bg-purple-500'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < last_visible_page && (
        <>
             {endPage < last_visible_page - 1 && <span className="px-4 py-2 text-gray-500">...</span>}
             <button onClick={() => onPageChange(last_visible_page)} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-purple-600 transition-colors">{last_visible_page}</button>
        </>
      )}

      <button
        onClick={handleNext}
        disabled={!has_next_page}
        className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
