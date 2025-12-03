import PropTypes from 'prop-types';


function QRScanLoadingScreen({ message = 'Processing...' }) {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <ClipLoader size={50} color='#1e1b4b' />
        <p className='mt-4 text-gray-600'>{message}</p>
      </div>
    </div>
  );
}

export default QRScanLoadingScreen;

QRScanLoadingScreen.propTypes = {
  message: PropTypes.string,
};
