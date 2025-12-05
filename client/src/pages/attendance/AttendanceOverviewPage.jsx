import AttendanceOverviewAdmin from '../../features/attendance/admin/AttendanceOverviewAdmin';
import AttendanceOverviewLecturer from '../../features/attendance/lecturer/AttendanceOverviewLecturer';
import AttendanceOverviewstudent from '../../features/attendance/student/AttendanceOverviewstudent';
import { useUser } from '../../features/auth/hooks/useUser';

function AttendanceOverviewPage() {
  const { data: user } = useUser();

  const role = user?.user?.role;
  return (
    <div className='flex'>
      {role === 'lecturer' && <AttendanceOverviewLecturer />}
      {role === 'student' && <AttendanceOverviewstudent />}
      {role === 'admin' && <AttendanceOverviewAdmin />}
    </div>
  );
}

export default AttendanceOverviewPage;
