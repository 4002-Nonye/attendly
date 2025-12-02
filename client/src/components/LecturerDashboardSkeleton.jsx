import AcademicInfoSkeleton from './AcademicInfoSkeleton';
import LecturerCourseCardSkeleton from './LecturerCourseCardSkeleton';
import TableSkeleton from './TableSkeleton';

function LecturerDashboardSkeleton() {
  return (
    <div className='w-full'>
      <AcademicInfoSkeleton />

      {/* Stats Cards  */}
      <div className='grid grid-cols-1  md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8'>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className='bg-white rounded-xl shadow-sm border border-gray-100 p-4  lg:p-6'
          >
            <div className='flex md:items-center gap-7 md:gap-0 flex-col-reverse  md:flex-row justify-between'>
              <div className='flex-1'>
                <div className='h-3 w-20 bg-gray-200 rounded animate-pulse mb-3'></div>
                <div className='h-7 w-16 bg-gray-200 rounded animate-pulse'></div>
              </div>
              <div className='w-10 h-10  lg:w-12 lg:h-12 bg-gray-200 rounded-lg animate-pulse'></div>
            </div>
          </div>
        ))}
      </div>
      {/* My Courses Section  */}
    <LecturerCourseCardSkeleton/>
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
