import TableSkeleton from "./TableSkeleton";

function ReportSkeleton() {
  return (
    <div className='w-full animate-pulse'>


      {/* Course Info Skeleton */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
        {/* Course Title Skeleton */}
        <div className='flex items-start justify-between mb-4 pb-4 border-b border-gray-100'>
          <div className='h-6 bg-gray-200 rounded w-80'></div>
        </div>

        {/* Inline Stats Skeleton */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className='h-3 bg-gray-200 rounded w-16 mb-2'></div>
              <div className='h-8 bg-gray-200 rounded w-12'></div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Alert Skeleton */}
      <div className='bg-gray-200 rounded-lg p-4 mb-6'>
        <div className='h-4 bg-gray-200 rounded w-3/4'></div>
      </div>

      {/* Search and Download Skeleton */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <div className='flex gap-3 justify-between items-center'>
          <div className='w-2/4 h-13 bg-gray-200 rounded-lg'></div>
          <div className='w-40 h-10 bg-gray-200 rounded-lg'></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <TableSkeleton showSkeletonHead={false} />
    </div>
  );
}

export default ReportSkeleton;