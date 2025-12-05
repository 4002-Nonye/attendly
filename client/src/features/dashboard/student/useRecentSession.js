import { useQuery } from '@tanstack/react-query';

import { getStudentRecentSessions } from '../../../apis/dashboardStats/apiStats';

export function useStudentRecentSession() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['recent-sessions', 'student'],
    queryFn: getStudentRecentSessions,
  });
  return { data, isPending, error, isError };
}
