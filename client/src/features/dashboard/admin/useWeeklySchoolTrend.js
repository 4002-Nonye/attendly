import { useQuery } from '@tanstack/react-query';

import { getWeeklyAttendanceBySchool } from '../../../apis/dashboardStats/apiStats';

export function useWeeklySchoolTrend() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['school-chart', 'trend'],
    queryFn: getWeeklyAttendanceBySchool,
  });

  return { data, isError, isPending, error };
}
