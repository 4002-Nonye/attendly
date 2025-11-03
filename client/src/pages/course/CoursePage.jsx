import { useUser } from '../../features/auth/hooks/useUser';
import AdminCourse from '../../features/course/admin/AdminCourse';
import LecturerCourse from '../../features/course/lecturer/LecturerCourse';
import StudentCourse from '../../features/course/student/StudentCourse';

function CoursePage() {
  const { data: user } = useUser();

  const role = user?.user?.role;
  return (
    <div className='flex'>
      {role === 'admin' && <AdminCourse />}
      {role === 'lecturer' && <LecturerCourse />}
      {role === 'student' && <StudentCourse />}
    </div>
  );
}

export default CoursePage;
