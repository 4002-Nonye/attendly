import { useQuery } from '@tanstack/react-query';
import { getWeeklyAttendanceByFaculty } from '../../../apis/dashboardStats/apiStats';

export function useWeeklyFacultyTrend() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['faculty-chart','trend'],
    queryFn: getWeeklyAttendanceByFaculty,
  });

  return { data, isError, isPending, error };
}
