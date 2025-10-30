import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { editFaculty } from '../../../apis/faculty/apiFaculty';

export function useEditFaculty() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editFaculty,
    onSuccess: (data) => {
      toast.success(data.message || 'Faculty updated successfully');
      queryClient.invalidateQueries(['facultyStats']);
    },
    onError: (err) => toast.error(err.error || 'Failed to update faculty'),
  });

  return { editFaculty: mutation.mutate, isPending: mutation.isPending };
}
