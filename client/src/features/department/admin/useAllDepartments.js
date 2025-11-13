import { useQuery } from '@tanstack/react-query';
import { getAllDepartments } from '../../../apis/department/apiDepartment';


export function useAllDepartments() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['departments-all'],
    queryFn: getAllDepartments,
  });
  return { data, isPending, error, isError };
}
