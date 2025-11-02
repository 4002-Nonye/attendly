import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { deleteCourse as deleteCourseApi } from '../../../apis/course/apiCourse';

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteCourseApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Course deleted successfully');
      queryClient.invalidateQueries(['courses']);
    },
    onError: (err) => toast.error(err.error || 'Failed to delete course'),
  });

  return { deleteCourse: mutation.mutate, isPending: mutation.isPending };
}
