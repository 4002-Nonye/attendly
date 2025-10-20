import { useQuery } from '@tanstack/react-query';

import { getFacultyTotalAdmin } from '../../../apis/dashboardStats/apiStats';

export function useFacultyTotal() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['faculty','total'],
    queryFn: getFacultyTotalAdmin,
  });
  return { data, isPending, error, isError };
}
