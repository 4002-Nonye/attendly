import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from  '../../../apis/auth/apiAuth';
import toast from 'react-hot-toast';

export function useLogin() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(`/${data.user.role}/dashboard`, { replace: true });
    },
    onError: (err) => {
      toast.error(err.error);
    },
  });

  return { login: mutation.mutate, isPending: mutation.isPending };
}
