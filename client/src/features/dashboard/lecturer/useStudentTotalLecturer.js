import { useQuery } from '@tanstack/react-query';

import {  getStudentTotalLecturer } from '../../../apis/dashboardStats/apiStats';

export function useStudentTotalLecturer() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['students','total'],
    queryFn: getStudentTotalLecturer,
  });
  return { data, isPending, error, isError };
}
