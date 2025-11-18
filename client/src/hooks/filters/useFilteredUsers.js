import { useMemo } from 'react';

export function useFilteredUsers(userData, searchQuery, filters={}) {
  return useMemo(() => {
    if (!userData) return [];

    return userData.filter((user) => {
      const fullName = user.fullName.toLowerCase();
      const email = user.email?.toLowerCase() || '';
      const matricNo = user.matricNo?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();

      // Search in fullName, email, AND matricNo
      const matchesSearch =
        fullName.includes(query) ||
        email.includes(query) ||
        matricNo.includes(query);

      const matchesFaculty =
        !filters.faculty || user.faculty?._id === filters.faculty;

      const matchesDepartment =
        !filters.department || user.department?._id === filters.department;

      const matchesLevel =
        !filters.level || user?.level === Number(filters.level);

      return (
        matchesSearch && matchesFaculty && matchesDepartment && matchesLevel
      );
    });
  }, [userData, filters, searchQuery]);
}
