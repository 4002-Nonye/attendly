import { useQuery } from '@tanstack/react-query';

import { getDepartmentStats } from '../../../apis/department/apiDepartment';

export function useDepartmentStats() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['departmentStats'],
    queryFn: getDepartmentStats,
  });
  return { data, isPending, error, isError };
}
