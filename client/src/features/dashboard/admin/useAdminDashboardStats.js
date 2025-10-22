import { useQuery } from '@tanstack/react-query';

import {
  getAdminDashboardStats,

} from '../../../apis/dashboardStats/apiStats';

export function useAdminDashboardStats() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['dashboard-stats', 'admin'],
    queryFn: getAdminDashboardStats,
  });
  return { data, isPending, error, isError };
}
