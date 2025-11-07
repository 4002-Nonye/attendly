import { useState } from 'react';
import { useCreateSession } from './useCreateSession';

export function useHandleCreateSession() {
  const { createSession } = useCreateSession();
  const [activeCourseId, setActiveCourseId] = useState(null);

  const handleCreateSession = (courseId) => {
    setActiveCourseId(courseId);
    createSession(courseId, {
      onSettled: () => setActiveCourseId(null),
    });
  };

  return { handleCreateSession, activeCourseId };
}
