import { useMemo } from "react";

export function useFilteredSessions(sessions, query) {
  return useMemo(() => {
    if (!sessions) return [];
    return sessions.filter(
      (session) =>
        session.course.courseCode.toLowerCase().includes(query.toLowerCase()) ||
        session.course.courseTitle.toLowerCase().includes(query.toLowerCase()) ||
        session.startedBy.fullName.toLowerCase().includes(query.toLowerCase())
    );
  }, [sessions, query]);
}