import { useQuery } from '@tanstack/react-query';

import { getDepartmentStats } from '../../../apis/department/apiDepartment';

export function useDepartmentStats(filters={},options={}) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['departmentStats',filters],
    queryFn: getDepartmentStats,
    ...options
  });
  return { data, isPending, error, isError };
}


