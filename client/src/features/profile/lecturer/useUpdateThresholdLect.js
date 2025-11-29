import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';

import { updateAttendanceThresholdLecturer as updateAttendanceThresholdLecturerApi } from '../../../apis/attendance/apiAttendance';

export function useUpdateThresholdLect() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateAttendanceThresholdLecturerApi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['user-profile'])
    },
    onError: (err) => toast.error(err.error),
  });
  return {
    updateAttendanceThresholdLecturer: mutation.mutate,
    isPending: mutation.isPending,
  };
}
