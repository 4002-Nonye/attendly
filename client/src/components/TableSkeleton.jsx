function TableSkeleton() {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 mb-6 lg:mb-8'>
      <div className='p-4 lg:p-6 border-b border-gray-100'>
        <div className='h-5 w-48 bg-gray-200 rounded animate-pulse mb-2'></div>
        <div className='h-4 w-64 bg-gray-200 rounded animate-pulse'></div>
      </div>
      <div className='p-6'>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className='h-16 bg-gray-100 rounded mb-2 animate-pulse'
          ></div>
        ))}
      </div>
    </div>
  );
}

export default TableSkeleton;
