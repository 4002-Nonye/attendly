import { useQuery } from '@tanstack/react-query';
import { getRecentSessions } from '../../../apis/dashboardStats/apiStats';


export function useRecentSession() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['recent-sessions'],
    queryFn: getRecentSessions,
  });
  return { data, isPending, error, isError };
}
