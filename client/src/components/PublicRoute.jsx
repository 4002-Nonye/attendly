import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import { useUser } from '../features/auth/hooks/useUser';

function PublicRoute({ children }) {
  const { data, isPending } = useUser();

 
  // if authenticated, redirect based on profile completion
  if (!isPending && data?.user) {
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
