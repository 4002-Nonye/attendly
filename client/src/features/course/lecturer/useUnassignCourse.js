import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { unassignFromCourse as unassignFromCourseApi} from '../../../apis/course/apiCourse';

export function useUnassignCourse() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: unassignFromCourseApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Course(s) unassigned successfully');
      queryClient.invalidateQueries(['courses']);
    },
    onError: (err) => toast.error(err.error || 'Failed to unassign course(s)'),
  });

  return { unassignFromCourse: mutation.mutate, isPending: mutation.isPending };
}
