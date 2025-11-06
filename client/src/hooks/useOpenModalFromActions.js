import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useOpenModalFromActions(param = 'mode', targetValue = 'add', setShowModal) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const shouldOpen = searchParams.get(param) === targetValue;

    if (shouldOpen) {
      setShowModal(true);

      // remove the param so back/refresh doesnt reopen modal
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(param);
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, setShowModal, param, targetValue]);
}
