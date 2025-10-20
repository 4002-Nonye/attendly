import { useQuery } from '@tanstack/react-query';
import { getCoursesTotalAdmin } from '../../../apis/dashboardStats/apiStats';

export function useCourseTotalAdmin() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['courses-total', 'admin'],
    queryFn: getCoursesTotalAdmin,
  });
  return { data, isPending, error, isError };
}
