import { useQuery } from '@tanstack/react-query';

import { getFacultyStats } from '../../../apis/faculty/apiFaculty';

export function useFacultyStats(filters) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['facultyStats', filters],
    queryFn: getFacultyStats,
    
  });
  return { data, isPending, error, isError };
}
