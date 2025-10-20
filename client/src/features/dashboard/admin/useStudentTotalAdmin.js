import { useQuery } from '@tanstack/react-query';


import { getStudentTotalAdmin } from '../../../apis/dashboardStats/apiStats';

export function useStudentTotalAdmin() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['students','total'],
    queryFn: getStudentTotalAdmin,
  });
  return { data, isPending, error, isError };
}
