import { useQuery } from '@tanstack/react-query';

import {  getStudentTotal } from '../../apis/user/apiUser';

export function useStudentTotal() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['totalStudents'],
    queryFn: getStudentTotal,
  });
  return { data, isPending, error, isError };
}
