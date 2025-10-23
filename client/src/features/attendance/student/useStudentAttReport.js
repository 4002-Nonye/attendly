import { useQuery } from '@tanstack/react-query';
import { getStudentAttendanceReport } from '../../../apis/attendance/apiAttendance';

export function useStudentAttReport() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['attendance-report', 'student'],
    queryFn: getStudentAttendanceReport,

  });
  return { data, isPending, error, isError };
}
