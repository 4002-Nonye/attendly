import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { endSession as endSessionApi } from '../../../apis/session/apiSession';

export function useEndSession() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: endSessionApi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['sessions']);
          
    },
    onError: (err) => toast.error(err.error),
  });

  return { endSession: mutation.mutate, isPending: mutation.isPending };
}
