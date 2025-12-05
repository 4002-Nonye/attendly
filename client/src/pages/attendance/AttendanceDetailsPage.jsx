import AttendanceDetailsAdmin from '../../features/attendance/admin/AttendanceDetailsAdmin';
import AttendanceDetailsLecturer from '../../features/attendance/lecturer/AttendanceDetailsLecturer';
import AttendanceDetailsStudent from '../../features/attendance/student/AttendanceDetailsStudent';
import { useUser } from '../../features/auth/hooks/useUser';

function AttendanceDetailsPage() {
  const { data: user } = useUser();

  const role = user?.user?.role;
  return (
    <div className='flex'>
      {role === 'lecturer' && <AttendanceDetailsLecturer />}
      {role === 'student' && <AttendanceDetailsStudent />}
      {role === 'admin' && <AttendanceDetailsAdmin />}
    </div>
  );
}

export default AttendanceDetailsPage;
