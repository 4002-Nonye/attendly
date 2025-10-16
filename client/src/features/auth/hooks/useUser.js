import { useQuery } from '@tanstack/react-query';
import { getUser } from '../../../apis/auth/apiAuth';

export function useUser() {
  const { data, isPending } = useQuery({
    queryKey: ['auth-user'],
    queryFn: getUser,
    retry: false,
  });

  return {
    data,
    isPending,
    isAuthenticated: !!data?.user,
  };
}
