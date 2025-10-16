import logo from '../assets/logo-black.svg';
function SkeletonSidebar() {
  return (
    <div className='w-64 h-screen bg-white border-r border-gray-200 flex flex-col'>
      {/* Header Skeleton */}
      <div className='h-16 flex items-center px-6 border-b border-gray-200'>
        <img src={logo} alt='logo' className='h-8 w-auto' />
        <h1 className='text-xl font-semibold tracking-tight ml-2'>Attendly</h1>
      </div>

      {/* Main Menu Skeleton */}
      <nav className='flex-1 px-3 py-4 space-y-1'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className='flex items-center gap-3 px-3 py-2.5 rounded-lg'
          >
            <div className='w-5 h-5 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-4 flex-1 bg-gray-200 rounded animate-pulse'></div>
          </div>
        ))}
      </nav>

      {/* Bottom Menu Skeleton */}
      <div className='px-3 py-4 border-t border-gray-200 space-y-1'>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className='flex items-center gap-3 px-3 py-2.5 rounded-lg'
          >
            <div className='w-5 h-5 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-4 flex-1 bg-gray-200 rounded animate-pulse'></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonSidebar;
