
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
      
      </div>
  );
}

export default AttendanceOverviewPage;
