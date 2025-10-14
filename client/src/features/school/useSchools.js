import { useQuery } from '@tanstack/react-query';
import { getSchools } from '../../apis/school/apiSchool';

export function useSchools() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['schools'],
    queryFn: getSchools,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
  });

  return { data, isError, isPending, error };
}
