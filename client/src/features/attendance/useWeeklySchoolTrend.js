import { useQuery } from '@tanstack/react-query';
import { getWeeklyAttendanceBySchool } from '../../apis/attendance/apiAttendance';

export function useWeeklySchoolTrend() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['attendanceTrendWeeklyBySchool'],
    queryFn: getWeeklyAttendanceBySchool,
  });

  return { data, isError, isPending, error };
}
