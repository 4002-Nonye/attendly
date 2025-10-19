import logo from '../assets/logo-black.svg';

function SkeletonApp() {
  return (
    <div className='flex h-screen overflow-hidden bg-gray-50'>
      {/* Sidebar Skeleton */}
      <aside className='hidden lg:flex w-72 h-screen bg-white border-r border-gray-200 flex-col'>
        {/* Header Skeleton */}
        <div className='h-20 flex items-center px-6 border-b border-gray-200'>
          <img src={logo} alt='logo' className='h-10 w-auto' />
          <h1 className='text-xl font-semibold tracking-tight ml-2'>
            Attendly
          </h1>
        </div>

        {/* Main Menu Skeleton */}
        <nav className='flex-1 px-4 py-6 space-y-1 overflow-y-auto'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='flex items-center gap-3 px-4 py-3 rounded-lg'
            >
              <div className='w-5 h-5 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-4 flex-1 bg-gray-200 rounded animate-pulse'></div>
            </div>
          ))}
        </nav>

        {/* Bottom Menu Skeleton */}
        <div className='px-2 py-4 border-t border-gray-200 space-y-1'>
          {/* Settings/Logout Skeleton */}
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className='flex items-center gap-3 px-4 py-3 rounded-lg'
            >
              <div className='w-5 h-5 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-4 flex-1 bg-gray-200 rounded animate-pulse'></div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area Skeleton */}
      <main className='flex-1 overflow-y-auto'>
        <div className='p-4 md:p-6 lg:p-8'>
          {/* School Name Header */}
          <div className='mb-8'>
            <div className='h-8 bg-gray-200 rounded w-80 animate-pulse'></div>
          </div>

          {/* Welcome Header & Academic Info */}
          <div className='mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
            <div className='space-y-2 flex-1'>
              <div className='h-10 bg-gray-200 rounded w-96 animate-pulse'></div>
              <div className='h-5 bg-gray-200 rounded w-64 animate-pulse'></div>
            </div>
            <div className='flex gap-8'>
              <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-24 animate-pulse'></div>
                <div className='h-6 bg-gray-200 rounded w-20 animate-pulse'></div>
              </div>
              <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-20 animate-pulse'></div>
                <div className='h-6 bg-gray-200 rounded w-16 animate-pulse'></div>
              </div>
            </div>
          </div>

          {/* Stats Grid Skeleton - 2x2 grid + 1 */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'
              >
                <div className='flex items-center justify-between mb-4'>
                  <div className='w-12 h-12 bg-gray-200 rounded-lg animate-pulse'></div>
                  <div className='w-5 h-5 bg-gray-200 rounded animate-pulse'></div>
                </div>
                <div className='h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse'></div>
                <div className='h-9 bg-gray-200 rounded w-16 animate-pulse'></div>
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'
              >
                <div className='flex items-center justify-between mb-4'>
                  <div>
                    <div className='h-6 bg-gray-200 rounded w-40 mb-2 animate-pulse'></div>
                    <div className='h-4 bg-gray-200 rounded w-56 animate-pulse'></div>
                  </div>
                  <div className='h-8 bg-gray-200 rounded w-12 animate-pulse'></div>
                </div>
                <div className='h-64 bg-gray-100 rounded-lg animate-pulse'></div>
              </div>
            ))}
          </div>

          {/* Recent Sessions Table Skeleton */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 mb-8'>
            <div className='p-6 border-b border-gray-100'>
              <div className='h-6 bg-gray-200 rounded w-52 mb-2 animate-pulse'></div>
              <div className='h-4 bg-gray-200 rounded w-72 animate-pulse'></div>
            </div>
            <div className='overflow-x-auto'>
              {/* Table Header */}
              <div className='px-6 py-3 bg-gray-50 border-b'>
                <div className='flex gap-4'>
                  <div className='flex-1 h-3 bg-gray-200 rounded animate-pulse'></div>
                  <div className='flex-1 h-3 bg-gray-200 rounded animate-pulse'></div>
                  <div className='flex-1 h-3 bg-gray-200 rounded animate-pulse'></div>
                  <div className='flex-1 h-3 bg-gray-200 rounded animate-pulse'></div>
                  <div className='w-20 h-3 bg-gray-200 rounded animate-pulse'></div>
                </div>
              </div>
              {/* Table Rows */}
              <div className='p-6 space-y-4'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='flex items-center gap-4'>
                    <div className='flex-1 h-14 bg-gray-100 rounded animate-pulse'></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse'></div>
            <div className='flex flex-wrap gap-3'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='h-10 bg-gray-200 rounded w-40 animate-pulse'
                ></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SkeletonApp;
