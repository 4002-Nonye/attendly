
function AcademicInfoSkeleton() {
  return (
    <>
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
    </>
  )
}

export default AcademicInfoSkeleton