import PropTypes from 'prop-types';

function TableSkeletonRows({ columns = 6, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className='animate-pulse'>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className='px-6 py-4'>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

TableSkeletonRows.propTypes = {
  columns: PropTypes.number,
  rows: PropTypes.number,
};

export default TableSkeletonRows;