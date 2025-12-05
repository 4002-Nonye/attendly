import { useEffect,useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSearchQuery(paramKey = 'search') {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get(paramKey) || '');

  // synce local query in sync if URL changes - going back
  useEffect(() => {
    const urlValue = searchParams.get(paramKey) || '';
    if (urlValue !== query) {
      setQuery(urlValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, paramKey]);

  // update URL when query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query.trim()) params.set(paramKey, query);
    else params.delete(paramKey);
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return [query, setQuery];
}
