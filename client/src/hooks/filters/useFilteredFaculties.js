import { useMemo } from "react";

export function useFilteredFaculties(faculties, searchQuery) {
  return useMemo(() => {
    if (!faculties) return [];

    return faculties.filter((faculty) => {
      const name = faculty.name.toLowerCase();
      const fullName = `faculty of ${faculty.name}`.toLowerCase();
      const query = searchQuery.toLowerCase();

      return name.includes(query) || fullName.includes(query);
    });
  }, [faculties, searchQuery]);
}
