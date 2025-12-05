import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { deleteFaculty as deleteFacultyApi } from '../../../apis/faculty/apiFaculty';

export function useDeleteFaculty() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteFacultyApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Faculty deleted successfully');
      queryClient.invalidateQueries(['facultyStats']);
    },
    onError: (err) => toast.error(err.error || 'Failed to delete faculty'),
  });

  return { deleteFaculty: mutation.mutate, isPending: mutation.isPending };
}
