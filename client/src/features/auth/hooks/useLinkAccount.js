import { useMutation } from '@tanstack/react-query';
import { linkAccount as linkAccountApi } from '../../../apis/auth/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
export function useLinkAccount() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: linkAccountApi,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(`/${data.user.role}/dashboard`, { replace: true });
    },
    onError: (err) => toast.error(err.error),
  });
  return { linkAccount: mutation.mutate, isPending: mutation.isPending };
}
