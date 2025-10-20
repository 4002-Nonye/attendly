import { useQuery } from '@tanstack/react-query';

import { getLecturerTotalAdmin } from '../../../apis/dashboardStats/apiStats';

export function useLecturerTotal() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['lecturer','total'],
    queryFn: getLecturerTotalAdmin,
   
  });
  return { data, isPending, error, isError };
}
