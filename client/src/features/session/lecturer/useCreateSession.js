import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { createSession as createSessionApi } from '../../../apis/session/apiSession';

export function useCreateSession() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: createSessionApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Session created successfully');
      queryClient.invalidateQueries(['sessions']);

      navigate(`/sessions/${data.session._id}`, {
        state: {
          sessionData: data.session,
        },
        replace: true,
      });
    },
    onError: (err) => toast.error(err.error || 'Failed to create session'),
  });

  return { createSession: mutation.mutate, isPending: mutation.isPending };
}
