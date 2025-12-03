import PropTypes from "prop-types";


function QRScanErrorScreen({ 
  title = '❌ Failed', 
  message = 'Something went wrong.' 
}) {
  return (
    <div className='flex h-screen items-center justify-center bg-red-50'>
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-4">
          <svg className="w-20 h-20 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-800 mb-2">{title}</h2>
        <p className="text-red-700 mb-4">{message}</p>
        <p className="text-sm text-red-600">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
QRScanErrorScreen.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};
export default QRScanErrorScreen


