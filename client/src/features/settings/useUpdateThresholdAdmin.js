import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';

import { updateAttendanceThresholdAdmin as updateAttendanceThresholdAdminApi } from '../../apis/school/apiSchool';

export function useUpdateThresholdAdmin() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateAttendanceThresholdAdminApi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['user-profile']);
    },
    onError: (err) => toast.error(err.error),
  });
  return {
    updateAttendanceThresholdAdmin: mutation.mutate,
    isPending: mutation.isPending,
  };
}
