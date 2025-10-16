import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from '../features/auth/hooks/useUser';
import { ClipLoader } from 'react-spinners';

function CompleteProfileProtected({ children }) {
  const { data, isPending } = useUser();

  if (isPending) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <ClipLoader size={50} color='#1e1b4b' />
          <p className='mt-4 text-sm text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in → login
  if (!data?.user) {
    return <Navigate to='/login' replace />;
  }

  // Already has role → dashboard (already completed profile)
  if (data?.user?.role) {
    return <Navigate to='/dashboard' replace />;
  }

  // Needs to complete profile → show page
  return children;
}

CompleteProfileProtected.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CompleteProfileProtected;