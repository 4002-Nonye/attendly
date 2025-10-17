import { useQuery } from '@tanstack/react-query';

import { getLecturerTotal } from '../../apis/user/apiUser';

export function useLecturerTotal() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['totalLecturers'],
    queryFn: getLecturerTotal,
   
  });
  return { data, isPending, error, isError };
}
