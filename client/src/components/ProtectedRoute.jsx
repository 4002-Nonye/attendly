import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from '../features/auth/hooks/useUser';
import SkeletonSidebar from './SkeletonSidebar';

function ProtectedRoute({ children }) {
  const { data, isPending } = useUser();

  // Show loading spinner while checking authentication
  if (isPending) {
    return <SkeletonSidebar />;
  }

  // Not authenticated redirect to login (home)
  if (!data?.user) {
    return <Navigate to='/' replace />;
  }

  // Authenticated but no role → redirect to complete profile
  if (!data?.user?.role) {
    return <Navigate to='/complete-profile' replace />;
  }

  // Authenticated and has role → allow access
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;