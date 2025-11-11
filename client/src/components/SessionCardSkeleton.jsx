import PropTypes from 'prop-types';

function SessionsCardSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className='bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-full animate-pulse'
        >
          {/* Header */}
          <div className='mb-4'>
            <div className='flex items-start justify-between gap-3 mb-2'>
              {/* Course Code */}
              <div className='flex-1'>
                <div className='h-5 bg-gray-200 rounded w-24'></div>
              </div>

              {/* Status  */}
              <div className='h-6 bg-gray-200 rounded-full w-16'></div>
            </div>

            {/* Course Title */}
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
          </div>

          {/* Started By & Time  */}
          <div className='flex-grow my-4'>
            <div className='grid grid-cols-2 gap-4'>
              {/* Started By */}
              <div className='space-y-1'>
                <div className='h-3 bg-gray-200 rounded w-16'></div>
                <div className='h-4 bg-gray-200 rounded w-20'></div>
              </div>

              {/* Started At */}
              <div className='space-y-1'>
                <div className='h-3 bg-gray-200 rounded w-16'></div>
                <div className='h-4 bg-gray-200 rounded w-16'></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2 mt-auto'>
            <div className='h-9 bg-gray-200 rounded-lg flex-1'></div>
            <div className='h-9 bg-gray-200 rounded-lg flex-1'></div>
          </div>
        </div>
      ))}
    </>
  );
}

export default SessionsCardSkeleton;
