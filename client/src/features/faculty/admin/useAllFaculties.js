import { useQuery } from '@tanstack/react-query';
import { getAllFaculties } from '../../../apis/faculty/apiFaculty';

export function useAllFaculties() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['faculties-all'],
    queryFn:getAllFaculties,

  });
  return { data, isPending, error, isError };
}
