import { useMutation } from '@tanstack/react-query';
import { completeProfile as completeProfileApi } from '../../../apis/auth/apiAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export function useCompleteProfile() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: completeProfileApi,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(`/dashboard`, { replace: true });
    },
    onError: (err) => {
      toast.error(err.error);
    },
  });
  return { completeProfile: mutation.mutate, isPending: mutation.isPending };
}
