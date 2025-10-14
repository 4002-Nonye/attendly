import { useMutation } from '@tanstack/react-query';
import { resetPassword as resetPasswordApi } from '../../../apis/auth/apiAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function useResetPassword() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: (data) => {
      toast.success(data.message), navigate('/login',{replace:true});
    },
    onError: (err) => toast.error(err.error),
  });
  return { resetPassword: mutation.mutate, isPending: mutation.isPending };
}
