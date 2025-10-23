import AcademicInfoSkeleton from './AcademicInfoSkeleton';
import TableSkeleton from './TableSkeleton';

function LecturerDashboardSkeleton() {
  return (
    <div className='w-full'>
      <AcademicInfoSkeleton />

      {/* Stats Cards  */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8'>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6'
          >
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <div className='h-3 w-20 bg-gray-200 rounded animate-pulse mb-3'></div>
                <div className='h-7 w-16 bg-gray-200 rounded animate-pulse'></div>
              </div>
              <div className='w-10 h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-lg animate-pulse'></div>
            </div>
          </div>
        ))}
      </div>
      {/* My Courses Section  */}
      <div className='mb-6 lg:mb-8'>
        <div className='flex items-center justify-between mb-4 lg:mb-5'>
          <div>
            <div className='h-6 w-32 bg-gray-200 rounded animate-pulse mb-2'></div>
            <div className='h-3 w-48 bg-gray-200 rounded animate-pulse'></div>
          </div>
          <div className='h-4 w-16 bg-gray-200 rounded animate-pulse'></div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4'>
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className='bg-white rounded-lg border border-gray-200 p-4'
            >
              {/* Header */}
              <div className='mb-4'>
                <div className='flex items-start justify-between gap-2 mb-2'>
                  <div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
                  <div className='h-5 w-16 bg-gray-200 rounded animate-pulse'></div>
                </div>
                <div className='h-3 w-24 bg-gray-200 rounded animate-pulse'></div>
              </div>

              {/* Stats */}
              <div className='flex items-center gap-4 mb-4 pb-4 border-b border-gray-100'>
                <div className='h-3 w-12 bg-gray-200 rounded animate-pulse'></div>
                <div className='h-3 w-16 bg-gray-200 rounded animate-pulse'></div>
                <div className='h-3 w-16 bg-gray-200 rounded animate-pulse'></div>
              </div>

              {/* Action */}
              <div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Sessions Table  */}
      <TableSkeleton />
      {/* Quick Actions  */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6'>
        <div className='h-5 w-32 bg-gray-200 rounded animate-pulse mb-4'></div>
        <div className='flex flex-wrap gap-3'>
          <div className='h-9 w-36 bg-gray-200 rounded-lg animate-pulse'></div>
          <div className='h-9 w-36 bg-gray-200 rounded-lg animate-pulse'></div>
        </div>
      </div>
    </div>
  );
}

export default LecturerDashboardSkeleton;
