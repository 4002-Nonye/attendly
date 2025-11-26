import { useQuery } from '@tanstack/react-query';
import { getAdminCourseAttendanceDetails } from '../../../apis/attendance/apiAttendance';

export function useAttendanceDetails(courseId) {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['attendance', 'details', courseId],
    queryFn: () => getAdminCourseAttendanceDetails(courseId),
  });

  return { data, isError, isPending, error };
}
