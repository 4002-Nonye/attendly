import { useMutation } from '@tanstack/react-query';
import { forgotPassword as forgotPasswordApi } from '../../../apis/general/apiAuth';
import toast from 'react-hot-toast';

export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (data) => toast.success(data.message),
    onError: (err) => toast.error(err.error),
  });
  return { forgotPassword: mutation.mutate, isPending: mutation.isPending };
}
