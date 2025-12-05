import { useQuery } from '@tanstack/react-query';

import { getLecturerAttendanceOverview } from '../../../apis/attendance/apiAttendance';

export function useAttendanceOverview() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['attendance', 'overview'],
    queryFn: getLecturerAttendanceOverview,
  });

  return { data, isError, isPending, error };
}
