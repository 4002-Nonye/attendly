import AcademicInfoSkeleton from "./AcademicInfoSkeleton";


function ProfileSkeleton() {
  return (
    <div className='w-full animate-pulse'>
      <AcademicInfoSkeleton

      />
      
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        {/* Profile Header Skeleton */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex flex-col items-center text-center'>
              {/* Avatar skeleton */}
              <div className='w-32 h-32 bg-gray-200 rounded-full mb-4 animate-pulse'></div>
              
              {/* Name skeleton */}
              <div className='h-8 bg-gray-200 rounded w-3/4 mb-1 animate-pulse'></div>
              
              {/* Matric number skeleton */}
              <div className='h-5 bg-gray-200 rounded w-1/2 mb-2 animate-pulse'></div>
              
              {/* Email skeleton */}
              <div className='h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse'></div>
              
              {/* Divider */}
              <div className='w-full border-t border-gray-100 my-4'></div>
              
              {/* Status skeleton */}
              <div className='w-full flex items-center justify-between'>
                <div className='h-4 bg-gray-200 rounded w-1/4 animate-pulse'></div>
                <div className='h-6 bg-gray-200 rounded-full w-20 animate-pulse'></div>
              </div>
            </div>
          </div>
        </div>

        <div className='lg:col-span-2 space-y-6'>
          {/* Academic Info Skeleton */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-gray-200 rounded-lg animate-pulse'></div>
              <div className='flex-1'>
                <div className='h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2 animate-pulse'></div>
              </div>
            </div>

            {/* Fields grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded w-1/3 animate-pulse'></div>
                  <div className='h-5 bg-gray-200 rounded w-2/3 animate-pulse'></div>
                </div>
              ))}
            </div>

            {/* Academic year */}
            <div className='mt-6 pt-6 border-t border-gray-100'>
              <div className='flex items-center justify-between'>
                <div className='h-4 bg-gray-200 rounded w-1/4 animate-pulse'></div>
                <div className='h-6 bg-gray-200 rounded-full w-24 animate-pulse'></div>
              </div>
            </div>
          </div>

          {/* Security Settings Skeleton */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-gray-200 rounded-lg animate-pulse'></div>
              <div className='flex-1'>
                <div className='h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2 animate-pulse'></div>
              </div>
            </div>

            {/* Password section */}
            <div className='flex items-start gap-4 p-4 bg-gray-50 rounded-lg'>
              <div className='w-10 h-10 bg-gray-200 rounded-lg animate-pulse'></div>
              <div className='flex-1 space-y-3'>
                <div className='h-5 bg-gray-200 rounded w-1/4 animate-pulse'></div>
                <div className='h-4 bg-gray-200 rounded w-full animate-pulse'></div>
                <div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse'></div>
                <div className='h-9 bg-gray-200 rounded w-32 animate-pulse'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;