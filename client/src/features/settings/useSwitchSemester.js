import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { switchSemester as switchSemesterApi } from '../../apis/school/apiSchool';

export function useSwitchSemester() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: switchSemesterApi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['user-profile']);
    },
    onError: (err) => toast.error(err.error),
  });
  return {
    switchSemester: mutation.mutate,
    isPending: mutation.isPending,
  };
}
