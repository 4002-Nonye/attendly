import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createCourse as createCourseApi } from '../../../apis/course/apiCourse';

export function useCreateCourse() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createCourseApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Course created successfully');
      queryClient.invalidateQueries(['courses']);
    },
    onError: (err) => toast.error(err.error || 'Failed to create course'),
  });

  return { createCourse: mutation.mutate, isPending: mutation.isPending };
}
