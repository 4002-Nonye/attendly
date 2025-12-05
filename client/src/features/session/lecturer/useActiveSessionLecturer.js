import { useQuery } from '@tanstack/react-query';

import { getActiveSessionsLecturer } from '../../../apis/session/apiSession';

export function useActiveSessionLecturer() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['sessions','active'],
    queryFn: getActiveSessionsLecturer,
  });

  return { data, isError, isPending, error };
}
