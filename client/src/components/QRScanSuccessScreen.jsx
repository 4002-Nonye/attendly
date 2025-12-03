import PropTypes from 'prop-types';

function QRScanSuccessScreen({
  title = '✅ Success!',
  message = 'Operation completed successfully.',
}) {
  return (
    <div className='flex h-screen items-center justify-center bg-green-50'>
      <div className='text-center max-w-md mx-auto p-8'>
        <div className='mb-4'>
          <svg
            className='w-20 h-20 text-green-500 mx-auto'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h2 className='text-2xl font-bold text-green-800 mb-2'>{title}</h2>
        <p className='text-green-700'>{message}</p>
        <p className='text-sm text-green-600 mt-4'>
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}
QRScanSuccessScreen.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};
export default QRScanSuccessScreen;
