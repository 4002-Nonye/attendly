import { useQuery } from '@tanstack/react-query';

import { getSessionTotalLecturer } from '../../../apis/dashboardStats/apiStats';

export function useSessionTotal() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['session', 'total'],
    queryFn: getSessionTotalLecturer,
  });
  return { data, isPending, error, isError };
}
