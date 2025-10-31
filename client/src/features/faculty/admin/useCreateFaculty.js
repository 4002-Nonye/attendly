import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createFaculty as createFacultyApi} from '../../../apis/faculty/apiFaculty';

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createFacultyApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Faculty created successfully');
      queryClient.invalidateQueries(['facultyStats']);
    },
    onError: (err) => toast.error(err.error || 'Failed to create faculty'),
  });

  return { createFaculty: mutation.mutate, isPending: mutation.isPending };
}
