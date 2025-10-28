import { useUser } from '../../features/auth/hooks/useUser';
import StudentCourse from '../../features/course/student/StudentCourse';

function CoursePage() {
  const { data: user } = useUser();

  const role = user?.user?.role;
  return (
    <div className='flex'>
      {role === 'admin' && 'Admin course page'}
      {role === 'lecturer' && 'Lecturer course page'}
      {role === 'student' && <StudentCourse />}
    </div>
  );
}

export default CoursePage;
