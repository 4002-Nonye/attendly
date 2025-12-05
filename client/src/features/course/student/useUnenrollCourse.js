import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { unenrollCourse as unenrollCourseApi } from '../../../apis/course/apiCourse';

export function useUnenrollCourse() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: unenrollCourseApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Course(s) unregistered successfully');
      queryClient.invalidateQueries(['courses']);
    },
    onError: (err) => toast.error(err.error || 'Failed to register course(s)'),
  });

  return { unenrollCourse: mutation.mutate, isPending: mutation.isPending };
}
