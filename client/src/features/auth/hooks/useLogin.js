import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useLocation,useNavigate } from 'react-router-dom';

import { login as loginApi } from '../../../apis/auth/apiAuth';

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      toast.success(data.message);
      // Check if there's a returnTo URL from the QR scan redirect
      const returnTo = location.state?.returnTo || '/dashboard';
      navigate(returnTo, { replace: true });
    },
    onError: (err) => {
      toast.error(err.error);
    },
  });

  return { login: mutation.mutate, isPending: mutation.isPending };
}