

function ChartSkeleton() {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse'>
      <div className='h-5 bg-gray-200 rounded w-40 mb-2'></div>
      <div className='h-4 bg-gray-200 rounded w-48 mb-4'></div>
      <div className='h-64 bg-gray-100 rounded-lg'></div>
    </div>
  );
}

export default ChartSkeleton;
