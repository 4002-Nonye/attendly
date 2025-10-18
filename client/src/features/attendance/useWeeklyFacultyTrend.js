import { useQuery } from '@tanstack/react-query';
import { getWeeklyAttendanceByFaculty } from '../../apis/attendance/apiAttendance';

export function useWeeklyFacultyTrend() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['attendanceTrendWeeklyByFaculty'],
    queryFn: getWeeklyAttendanceByFaculty,
  });

  return { data, isError, isPending, error };
}
