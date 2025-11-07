import { useActiveSessionLecturer } from '../../session/lecturer/useActiveSessionLecturer';

export const useCourseSessionStatus = (courses) => {
  const { data: activeSessions, isPending: isActiveSessionPending } =
    useActiveSessionLecturer();

  const coursesWithSessionStatus = courses.map((course) => {
    const isOngoing = activeSessions?.session?.some(
      (session) => session.course._id === course._id
    );
    return {
      ...course,
      sessionStatus: isOngoing ? 'Ongoing' : 'Inactive',
      isOngoing,
    };
  });

  return {  coursesWithSessionStatus, isActiveSessionPending };
};
