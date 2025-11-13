import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../../../../apis/user/apiUser';

export function useStudents() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  return { data, isError, isPending, error };
}
