import { useQuery } from '@tanstack/react-query';
import { getCoursesTotal } from '../../../apis/course/apiCourse';

export function useCourseTotal() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['coursesTotal'],
    queryFn:getCoursesTotal,
  });
  return {  data, isPending, error, isError };
}
