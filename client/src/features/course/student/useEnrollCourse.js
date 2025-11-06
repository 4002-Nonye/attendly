import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { enrollCourse as enrollCourseApi } from '../../../apis/course/apiCourse';

export function useEnrollCourse() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: enrollCourseApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Course(s) registered successfully');
      queryClient.invalidateQueries(['courses']);
    },
    onError: (err) => toast.error(err.error || 'Failed to register course(s)'),
  });

  return { enrollCourse: mutation.mutate, isPending: mutation.isPending };
}
