import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createFaculty } from '../../../apis/faculty/apiFaculty';

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createFaculty,
    onSuccess: (data) => {
      toast.success(data.message || 'Faculty created successfully');
      queryClient.invalidateQueries({ queryKey: ['facultyStats'] });
     
    },
    onError: (err) => toast.error(err.error || 'Failed to create faculty'),
  });

  return { createNewFaculty: mutation.mutate, isPending: mutation.isPending };
}
