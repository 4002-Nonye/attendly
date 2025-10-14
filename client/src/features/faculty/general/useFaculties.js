import { useQuery } from '@tanstack/react-query';
import { getFaculties } from '../../../apis/general/apiFaculty';

export function useFaculties({ id }) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['faculties', id],
    queryFn: () => getFaculties(id),
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
        enabled: !!id && id !== '',

  });
  return { data, isPending, error, isError };
}
