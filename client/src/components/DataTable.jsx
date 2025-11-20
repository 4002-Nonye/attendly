import TableSkeleton from './TableSkeleton';
import TableSkeletonRows from './TableSkeletonRows';
import PropTypes from 'prop-types';

function DataTable({
  columns,
  renderRow,
  data,
  children,
  isPending = false,
  skeleton = true,
  showSkeletonHead,
}) {
  if (isPending && skeleton) {
    return <TableSkeleton showSkeletonHead={showSkeletonHead} />;
  }

  return (
    <div className='bg-white relative mb-8 rounded-xl shadow-sm border border-gray-100 overflow-visible'>
      {children}
      <div className='overflow-x-auto overflow-y-visible'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200 whitespace-nowrap'>
            {isPending && !skeleton ? (
              <TableSkeletonRows rows={5} />
            ) : (
              data?.map((row) => renderRow(row))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  children: PropTypes.node,
  isPending: PropTypes.bool,
  skeleton: PropTypes.bool,
  showSkeletonHead: PropTypes.bool,
};

export default DataTable;