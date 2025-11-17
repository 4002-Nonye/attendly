import { useMemo } from 'react';

export function useFilteredCourses(courses, searchQuery, filters={}) {
 
  return useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        course.courseCode.toLowerCase().includes(query) ||
        course.courseTitle.toLowerCase().includes(query);

      const matchesFaculty =
        !filters.faculty || course.faculty?._id === filters.faculty;

      const matchesDepartment =
        !filters.department || course.department?._id === filters.department;

      const matchesLevel =
        !filters.level || course.level === Number(filters.level);

      return (
        matchesSearch && matchesFaculty && matchesDepartment && matchesLevel
      );
    });
  }, [courses, searchQuery, filters]);
}
