import SectionIntro from './SectionIntro';
import TableSkeleton from './TableSkeleton';
import PropTypes from 'prop-types';

function DataTable({
  columns,
  renderRow,
  data,
  onEdit,
  onDelete,
  title,
  subTitle,
  showHeaderIntro = false,
  isPending = false,
  emptyMessage,
  emptySubMessage,
  EmptyIcon,
  emptyClassName,
  linkTo,
  length
}) {
  if (isPending) {
    return <TableSkeleton />;
  }
  return (
    <div className='bg-white mb-8 rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
      {showHeaderIntro && (
        <div className='p-6 border-b border-gray-100'>
          <SectionIntro
            title={title}
            subTitle={subTitle}
            linkTo={linkTo}
            length={length}
          />
        </div>
      )}

      {!data.length > 0 ? (
        <EmptyChart
          icon={EmptyIcon}
          message={emptyMessage}
          subMessage={emptySubMessage}
          className={emptyClassName}
        />
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className='px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
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
              {data.map((row) => renderRow(row))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  showHeaderIntro: PropTypes.bool,
  isPending: PropTypes.bool,
  emptyMessage: PropTypes.string,
  emptySubMessage: PropTypes.string,
  EmptyIcon: PropTypes.elementType,
  emptyClassName: PropTypes.string,
  length: PropTypes.number,
  linkTo: PropTypes.string,
};

export default DataTable;
