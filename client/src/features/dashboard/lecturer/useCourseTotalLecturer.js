import { useQuery } from '@tanstack/react-query';
import { getCoursesTotalLecturer } from '../../../apis/dashboardStats/apiStats';

export function useCourseTotalLecturer() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['courses-total', 'lecturer'],
    queryFn: getCoursesTotalLecturer,
  });
  return { data, isPending, error, isError };
}
