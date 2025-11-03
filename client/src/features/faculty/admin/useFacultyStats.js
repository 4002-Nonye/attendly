import { useQuery } from '@tanstack/react-query';

import { getFacultyStats } from '../../../apis/faculty/apiFaculty';

export function useFacultyStats( options = {}) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['facultyStats'],
    queryFn: getFacultyStats,
    ...options,
  });
  return { data, isPending, error, isError };
}
