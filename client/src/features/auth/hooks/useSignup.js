import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signUp as signUpApi } from '../../../apis/auth/apiAuth';
import toast from 'react-hot-toast';

export function useSignup() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: signUpApi,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(`/dashboard`, { replace: true });
    },
    onError: (err) => {
      toast.error(err.error);
    },
  });

  return { signup: mutation.mutate, isPending: mutation.isPending };
}
