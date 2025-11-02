import { useQuery } from '@tanstack/react-query';

import { getAllCourses } from '../../../apis/course/apiCourse';

export function useAllCourses(filters, options = {}) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['courses', filters],
    queryFn: getAllCourses,
    ...options,
  });
  return { data, isPending, error, isError };
}
