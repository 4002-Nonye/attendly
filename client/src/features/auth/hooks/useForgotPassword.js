import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { forgotPassword as forgotPasswordApi } from '../../../apis/auth/apiAuth';

export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (data) => toast.success(data.message),
    onError: (err) => toast.error(err.error),
  });
  return { forgotPassword: mutation.mutate, isPending: mutation.isPending };
}
