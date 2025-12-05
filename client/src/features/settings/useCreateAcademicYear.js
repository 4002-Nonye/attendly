import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createAcademicYear as createAcademicYearApi } from '../../apis/school/apiSchool';

export function useCreateAcademicYear() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createAcademicYearApi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['user-profile']);
    },
    onError: (err) => toast.error(err.error),
  });
  return {
    createAcademicYear: mutation.mutate,
    isPending: mutation.isPending,
  };
}
