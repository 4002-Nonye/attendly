import { useQuery } from '@tanstack/react-query';

import { getDepartments } from '../../../apis/general/apiDepartment';

export function useDepartments({ id }) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['departments', id],
    queryFn: () => getDepartments(id),
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
        enabled: !!id && id !== '', 
  });
  return { data, isPending, error, isError };
}
