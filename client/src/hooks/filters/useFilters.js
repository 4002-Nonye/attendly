import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useFilters(
  initialFilters = { faculty: '', department: '', level: '' }
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  // sync url
  useEffect(() => {
    const queryFromUrl = searchParams.get('search') || '';
    const facultyFromUrl = searchParams.get('faculty') || '';
    const deptFromUrl = searchParams.get('department') || '';
    const levelFromUrl = searchParams.get('level') || '';

    //  update if different
    if (queryFromUrl !== searchQuery) setSearchQuery(queryFromUrl);
    if (
      facultyFromUrl !== filters.faculty ||
      deptFromUrl !== filters.department ||
      levelFromUrl !== filters.level
    ) {
      setFilters({
        faculty: facultyFromUrl,
        department: deptFromUrl,
        level: levelFromUrl,
      });
    }
  }, [
    searchParams,
    filters.faculty,
    filters.department,
    filters.level,
    searchQuery,
  ]);

  // update url based on current state
  const updateUrl = (newQuery, newFilters) => {
    const params = {};
    if (newQuery.trim()) params.search = newQuery;
    if (newFilters.faculty) params.faculty = newFilters.faculty;
    if (newFilters.department) params.department = newFilters.department;
    if (newFilters.level) params.level = newFilters.level;

    setSearchParams(params, { replace: true });
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    updateUrl(value, filters);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };


    setFilters(newFilters);
    updateUrl(searchQuery, newFilters);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters(initialFilters);
    setSearchParams({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const hasActiveFilters =
    filters.faculty || filters.department || filters.level || searchQuery;

  return {
    searchQuery,
    filters,
    handleSearch,
    handleFilterChange,
    clearFilters,
    activeFiltersCount,
    hasActiveFilters,
  };
}
