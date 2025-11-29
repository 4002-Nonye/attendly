import { useQuery } from '@tanstack/react-query';

import { getUserProfile } from '../../../apis/user/apiUser';

export function useProfile() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });
  return { data, isPending, error, isError };
}
