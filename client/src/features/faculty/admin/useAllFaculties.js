import { useQuery } from '@tanstack/react-query';
import { getAllFaculties } from '../../../apis/faculty/apiFaculty';

export function useAllFaculties({ id }) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['faculties-all', id],
    queryFn: () => getAllFaculties(id),

  });
  return { data, isPending, error, isError };
}
