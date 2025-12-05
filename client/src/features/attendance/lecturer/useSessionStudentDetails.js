import { useQuery } from '@tanstack/react-query';

import {  getLecturerSessionStudentDetails } from '../../../apis/attendance/apiAttendance';

export function useSessionStudentDetails(ids) {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['attendance', 'session-details', ids.courseId, ids.sessionId],
    queryFn: () => getLecturerSessionStudentDetails(ids),
  });

  return { data, isError, isPending, error };
}
