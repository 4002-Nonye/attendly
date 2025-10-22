import { useQuery } from '@tanstack/react-query';
import { getStudentRegisteredCourses } from '../../../apis/course/apiCourse';

export function useRegisteredCourses() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['registered-courses', 'student'],
    queryFn: getStudentRegisteredCourses,
  });
  return { data, isPending, error, isError };
}
