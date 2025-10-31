import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { editDepartment as editDepartmentApi } from '../../../apis/department/apiDepartment';

export function useEditDepartment() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editDepartmentApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Department updated successfully');
      queryClient.invalidateQueries(['departmentStats']);
    },
    onError: (err) => toast.error(err.error || 'Failed to update department'),
  });

  return { editDepartment: mutation.mutate, isPending: mutation.isPending };
}
