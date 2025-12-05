import { useQuery } from '@tanstack/react-query';

import { getSessionDetails } from '../../../apis/session/apiSession';

export function useSessionDetail(id, options = {}) {
  const { data, isError, isFetching, isPending, error } = useQuery({
    queryKey: ['session-detail'],
    queryFn: () => getSessionDetails(id),
    ...options,
  });

  return { data, isError, isPending, error, isFetching };
}
