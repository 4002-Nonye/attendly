import { useQuery } from '@tanstack/react-query';

import { getFacultyTotal } from '../../../apis/faculty/apiFaculty';

export function useFacultyTotal() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['facultyTotal'],
    queryFn: getFacultyTotal,
  });
  return { data, isPending, error, isError };
}
