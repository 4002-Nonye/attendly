import { useQuery } from '@tanstack/react-query';
import {  getActiveSessionsStudent } from '../../../apis/session/apiSession';

export function useActiveSessionStudent() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['sessions','active'],
    queryFn: getActiveSessionsStudent,
  });

  return { data, isError, isPending, error };
}
