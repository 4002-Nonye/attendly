import { useQuery } from '@tanstack/react-query';
import { getWeeklyAttendance } from '../../apis/attendance/apiAttendance';

export function useWeeklyTrend() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['attendanceTrendWeekly'],
    queryFn: getWeeklyAttendance,
  });

  return { data, isError, isPending, error };
}
