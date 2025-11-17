import { useUser } from '../../features/auth/hooks/useUser';
import AttendanceDetailsLecturer from '../../features/attendance/lecturer/AttendanceDetailsLecturer';
import AttendanceDetailsStudent from '../../features/attendance/student/AttendanceDetailsStudent';

function AttendanceDetailsPage() {
  const { data: user } = useUser();

  const role = user?.user?.role;
  return (
    <div className='flex'>
      {role === 'lecturer' && <AttendanceDetailsLecturer />}
      {role === 'student' && <AttendanceDetailsStudent />}
    </div>
  );
}

export default AttendanceDetailsPage;
