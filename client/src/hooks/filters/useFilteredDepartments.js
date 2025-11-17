import { useMemo } from 'react';

export function useFilteredDepartments(deptData, searchQuery, filters) {
  return useMemo(() => {
    if (!deptData) return [];
    return deptData.filter((dept) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch = dept.name.toLowerCase().includes(query);

      const matchesFaculty =
        !filters.faculty || dept.faculty?._id === filters.faculty;

      return matchesSearch && matchesFaculty;
    });
  }, [deptData, searchQuery, filters]);
}
