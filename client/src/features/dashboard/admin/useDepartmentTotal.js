import { useQuery } from '@tanstack/react-query';

import { getDepartmentTotalAdmin } from '../../../apis/dashboardStats/apiStats';

export function useDepartmentTotal() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['department', 'total'],
    queryFn: getDepartmentTotalAdmin,
  });
  return { data, isPending, error, isError };
}
