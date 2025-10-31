import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createDepartment as createDepartmentApi } from '../../../apis/department/apiDepartment';

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createDepartmentApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Department created successfully');
      queryClient.invalidateQueries(['departmentStats']);
    },
    onError: (err) => toast.error(err.error || 'Failed to create department'),
  });

  return { createDepartment: mutation.mutate, isPending: mutation.isPending };
}
