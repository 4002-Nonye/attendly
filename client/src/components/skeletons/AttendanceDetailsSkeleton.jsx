import TableSkeleton from './TableSkeleton';

function AttendanceDetailsSkeleton() {
  return (
    <div className='w-full animate-pulse'>
      {/* Course Info Skeleton */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
        <div className='h-16 w-full bg-gray-200 rounded '></div>
      </div>

      {/* Table Skeleton */}
      <TableSkeleton showSkeletonHead={false} />
    </div>
  );
}

export default AttendanceDetailsSkeleton;
