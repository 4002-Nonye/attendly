function SessionDetailSkeleton() {
  return (
    <div className='w-full'>
      {/* Back Button Skeleton */}
      <div className='h-9 w-32 bg-gray-200 rounded-lg mb-7 animate-pulse'></div>

      {/* Main Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column - Course & Session Info */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Course Information Card */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            {/* Header with Icon */}
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-6 h-6 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-6 bg-gray-200 rounded w-48 animate-pulse'></div>
            </div>

            <div className='space-y-4'>
              {/* Course Code & Title */}
              <div>
                <div className='h-7 bg-gray-200 rounded w-32 mb-2 animate-pulse'></div>
                <div className='h-5 bg-gray-200 rounded w-64 animate-pulse'></div>
              </div>

              {/* Grid Info */}
              <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-200'>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className='h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse'></div>
                    <div className='h-4 bg-gray-200 rounded w-32 animate-pulse'></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Session Details Card */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            {/* Header with Icon */}
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-6 h-6 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-6 bg-gray-200 rounded w-40 animate-pulse'></div>
            </div>

            {/* Grid with Icons */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'>
                  <div className='w-5 h-5 bg-gray-300 rounded mt-0.5 animate-pulse'></div>
                  <div className='flex-1'>
                    <div className='h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse'></div>
                    <div className='h-4 bg-gray-200 rounded w-28 animate-pulse'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - QR Code Card */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6'>
            {/* Title */}
            <div className='h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse'></div>

            {/* QR Code Container */}
            <div className='bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-100 mb-4'>
              <div className='bg-white p-4 rounded-lg'>
                <div className='aspect-square bg-gray-200 rounded animate-pulse'></div>
              </div>
            </div>

            {/* Description Text */}
            <div className='h-4 bg-gray-200 rounded w-full mb-2 animate-pulse'></div>
            <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto mb-6 animate-pulse'></div>

            {/* Action Buttons */}
            <div className='space-y-3'>
              <div className='h-12 bg-gray-200 rounded-lg animate-pulse'></div>
              <div className='h-12 bg-gray-200 rounded-lg animate-pulse'></div>
            </div>

            {/* Session ID Info */}
            <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
              <div className='h-3 bg-gray-200 rounded w-24 mb-2 animate-pulse'></div>
              <div className='h-3 bg-gray-200 rounded w-full animate-pulse'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionDetailSkeleton;