import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { markAttendance as markAttendanceApi } from '../../../apis/session/apiSession';

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: markAttendanceApi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['sessions']);
    },
    onError: (err) => toast.error(err.error),
  });

  return { markAttendance: mutation.mutate, isPending: mutation.isPending };
}
