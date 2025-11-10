import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useCourseFilters(
  initialFilters = { department: '', level: '' }
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  // sync url
  useEffect(() => {
    const queryFromUrl = searchParams.get('search') || '';
    const deptFromUrl = searchParams.get('department') || '';
    const levelFromUrl = searchParams.get('level') || '';

    //  update if different
    if (queryFromUrl !== searchQuery) setSearchQuery(queryFromUrl);
    if (deptFromUrl !== filters.department || levelFromUrl !== filters.level) {
      setFilters({ department: deptFromUrl, level: levelFromUrl });
    }
  }, [searchParams, filters.department, filters.level, searchQuery]);

  // update url based on current state
  const updateUrl = (newQuery, newFilters) => {
    const params = {};
    if (newQuery.trim()) params.search = newQuery;
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

  return {
    searchQuery,
    filters,
    handleSearch,
    handleFilterChange,
    clearFilters,
  };
}
