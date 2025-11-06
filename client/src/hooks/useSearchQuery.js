import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSearchQuery(paramKey = 'search') {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get(paramKey) || '');

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query.trim()) params.set(paramKey, query);
    else params.delete(paramKey);
    setSearchParams(params);
  }, [query, paramKey, searchParams, setSearchParams]);

  return [query, setQuery];
}
