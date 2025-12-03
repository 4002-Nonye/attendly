import PropTypes from 'prop-types';

function QRScanWarningScreen({
  title = '⚠️ Warning',
  message = 'Please check and try again.',
}) {
  return (
    <div className='flex h-screen items-center justify-center bg-yellow-50'>
      <div className='text-center max-w-md mx-auto p-8'>
        <div className='mb-4'>
          <svg
            className='w-20 h-20 text-yellow-500 mx-auto'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
        </div>
        <h2 className='text-2xl font-bold text-yellow-800 mb-2'>{title}</h2>
        <p className='text-yellow-700'>{message}</p>
        <p className='text-sm text-yellow-600 mt-4'>
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}
QRScanWarningScreen.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};
export default QRScanWarningScreen;
