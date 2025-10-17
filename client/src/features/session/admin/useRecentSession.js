import { useQuery } from '@tanstack/react-query';
import { getRecentSessions } from '../../../apis/session/apiSession';

export function useRecentSession() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['recentSessions'],
    queryFn: getRecentSessions,
  });
  return { data, isPending, error, isError };
}
