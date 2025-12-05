import { useQuery } from '@tanstack/react-query';

import { getStudentSessionDetails } from '../../../apis/attendance/apiAttendance';

export function useStudentSessionDetails(courseId) {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['attendance', 'details', courseId],
    queryFn: () => getStudentSessionDetails(courseId),
  });

  return { data, isError, isPending, error };
}
