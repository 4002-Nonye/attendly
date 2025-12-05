import PropTypes from 'prop-types';

function StudentAttendanceCardSkeleton({ attendanceView = true }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {[...Array(4)].map((_, i) => (
        <div key={i} className='bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between h-full animate-pulse'>
          <div className='flex-grow'>
            <div className='flex items-start justify-between gap-3 mb-4'>
              <div className='flex-1 space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              </div>
              <div className='h-7 w-20 bg-gray-200 rounded-md'></div>
            </div>

            <div className='flex items-center gap-6 mb-4'>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-14 bg-gray-200 rounded'></div>
                <div className='h-4 w-6 bg-gray-200 rounded'></div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-10 bg-gray-200 rounded'></div>
                <div className='h-4 w-6 bg-gray-200 rounded'></div>
              </div>
            </div>

            {attendanceView && (
              <div className='mb-4'>
                <div className='h-4 w-32 bg-gray-200 rounded'></div>
              </div>
            )}
          </div>

          <div className='space-y-3'>
            <div className='border-t border-gray-200' />
            <div>
              <div className='flex justify-between items-center mb-2'>
                <div className='h-3 w-24 bg-gray-200 rounded'></div>
                <div className='h-3 w-8 bg-gray-200 rounded'></div>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'></div>
            </div>
            <div className='h-10 bg-gray-200 rounded-lg'></div>
          </div>
        </div>
      ))}
    </div>
  );
}

StudentAttendanceCardSkeleton.propTypes = {
  attendanceView: PropTypes.bool,
};

export default StudentAttendanceCardSkeleton;