import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteDepartment as deleteDepartmentApi } from '../../../apis/department/apiDepartment';

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteDepartmentApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Department deleted successfully');
      queryClient.invalidateQueries(['departmentStats']);
    },
    onError: (err) => toast.error(err.error || 'Failed to delete department'),
  });

  return { deleteDepartment: mutation.mutate, isPending: mutation.isPending };
}
