import { useQuery } from '@tanstack/react-query';

import { getDepartmentTotal } from '../../../apis/department/apiDepartment';

export function useDepartmentTotal() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['departmentsTotal'],
    queryFn:getDepartmentTotal,
  });
  return {  data, isPending, error, isError };
}
