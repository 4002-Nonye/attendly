import { useQuery } from '@tanstack/react-query';

import { getFacultyStats } from '../../../apis/faculty/apiFaculty';

export function useFacultyStats() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['facultyStats'],
    queryFn: getFacultyStats,
  });
  return { data, isPending, error, isError };
}
