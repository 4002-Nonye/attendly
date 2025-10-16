import { useMutation, useQueryClient } from '@tanstack/react-query';
import { linkAccount as linkAccountApi } from '../../../apis/auth/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
