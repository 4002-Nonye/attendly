import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { linkAccount as linkAccountApi } from '../../../apis/auth/apiAuth';
export function useLinkAccount() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: linkAccountApi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['auth-user']);
      navigate(`/dashboard`, { replace: true });
    },
    onError: (err) => toast.error(err.error),
  });
  return { linkAccount: mutation.mutate, isPending: mutation.isPending };
}
