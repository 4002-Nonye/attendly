import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { assignToCourse as assignToCourseApi } from '../../../apis/course/apiCourse';

export function useAssignCourse() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: assignToCourseApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Courses assigned successfully');
      queryClient.invalidateQueries(['courses']);
    },
    onError: (err) => toast.error(err.error || 'Failed to assign courses'),
  });

  return { assignToCourse: mutation.mutate, isPending: mutation.isPending };
}
