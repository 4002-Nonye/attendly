import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { editCourse as editCourseApi } from '../../../apis/course/apiCourse';

export function useEditCourse() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editCourseApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Course updated successfully');
      queryClient.invalidateQueries(['courses']);
    },
    onError: (err) => toast.error(err.error || 'Failed to update course'),
  });

  return { editCourse: mutation.mutate, isPending: mutation.isPending };
}
