import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from '../features/auth/hooks/useUser';
import { ClipLoader } from 'react-spinners';

function ProtectedRoute({ children, allowedRoles }) {
  const { data, isPending } = useUser();

  // Show loading spinner while checking authentication
  if (isPending) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-50'>
        <ClipLoader size={50} color='#1e1b4b' />
      </div>
    );
  }

  // Not authenticated redirect to login
  if (!data?.user) {
    return <Navigate to='/' replace />;
  }

  // Authenticated but no role - redirect to complete profile
  if (!data?.user?.role) {
    return <Navigate to='/complete-profile' replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(data.user.role)) {
    return <Navigate to='/dashboard' replace />;
  }

  // Authenticated and authorized - allow access
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
