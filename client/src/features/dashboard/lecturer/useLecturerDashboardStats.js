useLecturerDashboardStats

import { useQuery } from '@tanstack/react-query';
import { getLecturerDashboardStats } from '../../../apis/dashboardStats/apiStats';

export function useLecturerDashboardStats() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['dashboard-stats','lecturer'],
    queryFn: getLecturerDashboardStats,
  });
  return { data, isPending, error, isError };
}
