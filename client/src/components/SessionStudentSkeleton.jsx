import PropTypes from 'prop-types';
import TableSkeleton from './TableSkeleton';

function SessionStudentsSkeleton({ showSearchbar = true }) {
  return (
    <div className='w-full animate-pulse'>
      {/* Session Info Skeleton */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
        <div className='h-50 bg-gray-200 rounded-lg'></div>
      </div>

      {/* Search Bar Skeleton */}
      {showSearchbar && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
          <div className='h-12 bg-gray-200 rounded-lg'></div>
        </div>
      )}
      {/* Table Skeleton */}
      <TableSkeleton showSkeletonHead={false} />
    </div>
  );
}

SessionStudentsSkeleton.propTypes = {
  showSearchbar: PropTypes.bool,
};

export default SessionStudentsSkeleton;
