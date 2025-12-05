import { useQuery } from '@tanstack/react-query';

import {  getLecturerSessionDetails } from '../../../apis/attendance/apiAttendance';

export function useSessionDetails(courseId) {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['attendance', 'details',courseId],
    queryFn:()=> getLecturerSessionDetails(courseId),
  });

  return { data, isError, isPending, error };
}
