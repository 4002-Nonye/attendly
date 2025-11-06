import { useMemo } from "react";

export function useFilteredCourses(courses, query) {
  return useMemo(() => {
    if (!courses) return [];
    return courses.filter(
      (course) =>
        course.courseCode.toLowerCase().includes(query.toLowerCase()) ||
        course.courseTitle.toLowerCase().includes(query.toLowerCase())
    );
  }, [courses, query]);
}
