import { useQuery } from '@tanstack/react-query';

import { getLecturerAssignedCourses } from '../../../apis/course/apiCourse';

export function useAssignedCourses() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['courses-assigned', 'lecturer'],
    queryFn: getLecturerAssignedCourses,
  });
  return { data, isPending, error, isError };
}
