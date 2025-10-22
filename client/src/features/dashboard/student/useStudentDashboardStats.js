import { useQuery } from '@tanstack/react-query';
import { getStudentDashboardStats } from '../../../apis/dashboardStats/apiStats';

export function useStudentDashboardStats() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['dashboard-stats','student'],
    queryFn: getStudentDashboardStats,
  });
  return { data, isPending, error, isError };
}
