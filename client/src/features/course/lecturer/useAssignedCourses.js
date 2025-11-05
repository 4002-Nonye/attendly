import { useQuery } from '@tanstack/react-query';
import { getLecturerAssignedCourses } from '../../../apis/course/apiCourse';

export function useAssignedCourses(options = {}) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['courses', 'lecturer'],
    queryFn: getLecturerAssignedCourses,
    ...options,
  });
  return { data, isPending, error, isError };
}
