import AcademicInfoSkeleton from './AcademicInfoSkeleton';
import TableSkeleton from './TableSkeleton';

function StudentDashboardSkeleton() {
  return (
    <div className='w-full animate-pulse'>
      <AcademicInfoSkeleton />

      {/* Stats cards  */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6'
          >
            <div className='flex md:items-center flex-col-reverse md:flex-row gap-3 md:gap-0 justify-between'>
              <div className='flex-1'>
                <div className='h-4 w-20 bg-gray-200 rounded mb-2'></div>
                <div className='h-7 w-12 bg-gray-200 rounded'></div>
              </div>
              <div className='w-10 h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-lg'></div>
            </div>
          </div>
        ))}
      </div>

      {/* My Attendance by course section */}
      <div className='mb-6 lg:mb-8'>
        <div className='flex items-center justify-between mb-4 lg:mb-5'>
          <div>
            <div className='h-6 w-56 bg-gray-200 rounded mb-2'></div>
            <div className='h-4 w-64 bg-gray-200 rounded'></div>
          </div>
          <div className='h-4 w-16 bg-gray-200 rounded'></div>
        </div>

        {/* course cards  */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-xl border border-gray-200 p-5'
            >
              {/* Header */}
              <div className='mb-4'>
                <div className='flex items-start justify-between gap-2 mb-3'>
                  <div className='flex justify-between items-center w-full'>
                    {/* course Title */}
                    <div className='h-5 w-40 bg-gray-200 rounded'></div>
                    {/* course Code Badge */}
                    <div className='h-6 w-20 bg-gray-200 rounded-md'></div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className='flex gap-3 items-center pb-4 border-b border-gray-100'>
                {/* Attended sessions*/}
                <div className='flex items-center gap-2'>
                  <div className='h-3 w-16 bg-gray-200 rounded'></div>
                  <div className='h-3 w-6 bg-gray-200 rounded'></div>
                </div>
                {/* Total sessions */}
                <div className='flex items-center gap-2'>
                  <div className='h-3 w-20 bg-gray-200 rounded'></div>
                  <div className='h-3 w-6 bg-gray-200 rounded'></div>
                </div>
              </div>

              {/* Progress Bar Section */}
              <div className='my-3'>
                <div className='flex justify-between mb-2'>
                  <div className='h-3 w-12 bg-gray-200 rounded'></div>
                  <div className='h-3 w-8 bg-gray-200 rounded'></div>
                </div>
                {/* Progress Bar */}
                <div className='w-full bg-gray-200 rounded-full h-2.5'></div>
              </div>

              {/* CTA */}
              <div className='w-full h-10 bg-gray-200 rounded-lg'></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attendance Table */}
      <TableSkeleton />

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

export default StudentDashboardSkeleton;
