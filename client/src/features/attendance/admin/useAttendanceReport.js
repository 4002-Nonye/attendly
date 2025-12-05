import { useQuery } from '@tanstack/react-query';

import { getAdminAttendanceReport } from '../../../apis/attendance/apiAttendance';

export function useAttendanceReport() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['attendance', 'report'],
    queryFn: getAdminAttendanceReport,
  });

  return { data, isError, isPending, error };
}
