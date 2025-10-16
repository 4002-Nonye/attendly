import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from '../features/auth/hooks/useUser';
import { ClipLoader } from 'react-spinners';

function PublicRoute({ children }) {
  const { data, isPending } = useUser();

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-50'>
        <ClipLoader size={50} color='#1e1b4b' />
      </div>
    );
  }

  // If authenticated, redirect based on profile completion
  if (data?.user) {
    // Has role - go to dashboard
    if (data.user.role) {
      return <Navigate to='/dashboard' replace />;
    }
    // No role - complete profile first
    return <Navigate to='/complete-profile' replace />;
  }

  // Not authenticated -  show login/signup
  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
