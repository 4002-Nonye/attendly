import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeProfile as completeProfileApi } from '../../../apis/auth/apiAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


export function useCompleteProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: completeProfileApi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['auth-user']);
      navigate(`/dashboard`, { replace: true });
    },
    onError: (err) => {
      toast.error(err.error);
    },
  });
  return { completeProfile: mutation.mutate, isPending: mutation.isPending };
}
