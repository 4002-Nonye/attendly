import { useQuery } from '@tanstack/react-query';

import {  getLecturerAttendanceReport } from '../../../apis/attendance/apiAttendance';

export function useAttendanceReport(courseId) {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['attendance', 'report'],
    queryFn:() =>getLecturerAttendanceReport(courseId),
  });

  return { data, isError, isPending, error };
}
