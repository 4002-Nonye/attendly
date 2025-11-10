

export const useCourseSessionStatus = (courses,activeSessions) => {

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

  return {  coursesWithSessionStatus };
};
