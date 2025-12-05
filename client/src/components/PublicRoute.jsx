import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import { useUser } from '../features/auth/hooks/useUser';

function PublicRoute({ children }) {
  const { data, isPending } = useUser();

  // show loading while checking auth
  if (isPending) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-50'>
        <ClipLoader size={50} color='#1e1b4b' />
      </div>
    );
  }

  // if authenticated, redirect based on profile completion
  if (data?.user) {
    // has role - go to dashboard
    if (data.user.role) {
      return <Navigate to='/dashboard' replace />;
    }
    // no role - complete profile first
    return <Navigate to='/complete-profile' replace />;
  }

  // not authenticated -  show login/signup
  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
