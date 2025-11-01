import TableSkeleton from './TableSkeleton';
import TableSkeletonRows from './TableSkeletonRows';
import PropTypes from 'prop-types';

function DataTable({
  columns,
  renderRow,
  data,
  onEdit,
  onDelete,
  children,
  isPending = false,
  skeleton = true,
}) {
  // Calculate total columns
  const totalColumns = columns.length + (onEdit || onDelete ? 1 : 0);

  if (isPending && skeleton) {
    return <TableSkeleton />;
  }

  return (
    <div className='bg-white mb-8 rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
      {children}
      <div className='overflow-x-auto'>
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
              {(onEdit || onDelete) && (
                <th className='px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {isPending && !skeleton ? (
              <TableSkeletonRows columns={totalColumns} rows={5} />
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
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  children: PropTypes.node,
  isPending: PropTypes.bool,
  skeleton: PropTypes.bool,
};

export default DataTable;