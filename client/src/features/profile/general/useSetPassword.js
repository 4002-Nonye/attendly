import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setPassword as setPasswordApi } from '../../../apis/auth/apiAuth';
import toast from 'react-hot-toast';

export function useSetPassword() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: setPasswordApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['user-profile']);
      toast.success(data.message);
    },
    onError: (err) => toast.error(err.error),
  });
  return { setPassword: mutation.mutate, isPending: mutation.isPending };
}
