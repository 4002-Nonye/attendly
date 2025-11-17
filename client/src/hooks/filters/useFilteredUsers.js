import { useMemo } from 'react';

export function useFilteredUsers(userData, searchQuery, filters) {
  return useMemo(() => {
    if (!userData) return [];

    return userData.filter((lecturer) => {
      const fullName = lecturer.fullName.toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        fullName.includes(query) ||
        lecturer.email?.toLowerCase().includes(query);

      const matchesFaculty =
        !filters.faculty || lecturer.faculty?._id === filters.faculty;

      const matchesDepartment =
        !filters.department || lecturer.department?._id === filters.department;

      const matchesLevel = !filters.level || lecturer?.level === Number(filters.level);

      return matchesSearch && matchesFaculty && matchesDepartment && matchesLevel;
    });
  }, [userData, filters, searchQuery]);
}
