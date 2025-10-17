function SkeletonDashboard() {
  return (
    <div className='w-full animate-pulse'>
      {/* Welcome Header Skeleton */}
      <div className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <div className='h-9 bg-gray-200 rounded-lg w-80 mb-2'></div>
          <div className='h-5 bg-gray-200 rounded w-64'></div>
        </div>

        {/* Academic Info Skeleton */}
        <div className='flex gap-8'>
          <div>
            <div className='h-4 bg-gray-200 rounded w-24 mb-2'></div>
            <div className='h-6 bg-gray-200 rounded w-20'></div>
          </div>
          <div>
            <div className='h-4 bg-gray-200 rounded w-20 mb-2'></div>
            <div className='h-6 bg-gray-200 rounded w-16'></div>
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'
          >
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-gray-200 rounded-lg'></div>
              <div className='w-5 h-5 bg-gray-200 rounded'></div>
            </div>
            <div className='h-4 bg-gray-200 rounded w-32 mb-2'></div>
            <div className='h-8 bg-gray-200 rounded w-20'></div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <div className='h-5 bg-gray-200 rounded w-40 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-48 mb-4'></div>
          <div className='h-64 bg-gray-100 rounded-lg'></div>
        </div>
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <div className='h-5 bg-gray-200 rounded w-40 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-48 mb-4'></div>
          <div className='h-64 bg-gray-100 rounded-lg'></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 mb-8'>
        <div className='p-6 border-b border-gray-100'>
          <div className='h-5 bg-gray-200 rounded w-48 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-64'></div>
        </div>
        <div className='p-6 space-y-4'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='flex items-center gap-4'>
              <div className='flex-1 h-12 bg-gray-100 rounded'></div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Skeleton */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
        <div className='h-5 bg-gray-200 rounded w-32 mb-4'></div>
        <div className='flex flex-wrap gap-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-10 bg-gray-200 rounded w-32'></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkeletonDashboard;