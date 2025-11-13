import { useQuery } from '@tanstack/react-query';
import { getLecturers } from '../../../../apis/user/apiUser';


export function useLecturers() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['lecturers'],
    queryFn: getLecturers,
  });

  return { data, isError, isPending, error };
}
